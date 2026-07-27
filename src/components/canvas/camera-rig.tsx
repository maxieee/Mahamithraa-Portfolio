'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { SECTIONS } from '@/lib/content/sections';
import { getUi, mutable } from '@/lib/store';
import { MAX_FRAME_DELTA } from '@/lib/utils';
import { cameraFocus } from './camera-focus';

const TMP_POSITION = new Vector3();
const TMP_TARGET = new Vector3();
const TMP_OFFSET = new Vector3();
const LOOK_AHEAD = new Vector3();
const LOOK_BEHIND = new Vector3();

/**
 * Flies the camera along a Catmull-Rom curve threaded through every section
 * keyframe. Scroll is damped before it drives the curve, so the camera trails
 * the input slightly — that lag is what makes the movement read as cinematic
 * rather than scroll-locked.
 */
export function CameraRig() {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const rollRef = useRef(0);
  const introRef = useRef(0);

  const { positionCurve, targetCurve } = useMemo(() => {
    const positions = SECTIONS.map((s) => new Vector3(...s.camera));
    const targets = SECTIONS.map((s) => new Vector3(...s.target));
    return {
      positionCurve: new CatmullRomCurve3(positions, false, 'catmullrom', 0.42),
      targetCurve: new CatmullRomCurve3(targets, false, 'catmullrom', 0.42),
    };
  }, []);

  useFrame((_, rawDelta) => {
    // Cap delta so a background tab or a long GC pause cannot teleport the
    // camera when the loop resumes.
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    const { reducedMotion } = getUi();

    // --- Scroll damping -----------------------------------------------------
    const scrollLambda = reducedMotion ? 40 : 3.2;
    mutable.scrollEased = MathUtils.damp(
      mutable.scrollEased,
      mutable.scroll,
      scrollLambda,
      delta,
    );

    // --- Pointer damping ----------------------------------------------------
    const pointerLambda = 2.4;
    mutable.pointerEased.x = MathUtils.damp(
      mutable.pointerEased.x,
      reducedMotion ? 0 : mutable.pointer.x,
      pointerLambda,
      delta,
    );
    mutable.pointerEased.y = MathUtils.damp(
      mutable.pointerEased.y,
      reducedMotion ? 0 : mutable.pointer.y,
      pointerLambda,
      delta,
    );

    const t = MathUtils.clamp(mutable.scrollEased, 0, 1);
    // `getPoint` samples in parameter space, so t = i/(n-1) lands exactly on
    // keyframe i. `getPointAt` re-parameterises by arc length, which would
    // drift the camera off its section keyframes wherever the spacing between
    // environments is uneven — and it is, by design.
    positionCurve.getPoint(t, TMP_POSITION);
    targetCurve.getPoint(t, TMP_TARGET);

    // --- Opening move -------------------------------------------------------
    // The camera eases in from further back on first load, so the landing
    // title arrives rather than simply being there.
    if (introRef.current < 1) {
      introRef.current = MathUtils.damp(introRef.current, 1, reducedMotion ? 40 : 0.9, delta);
      const introPull = (1 - introRef.current) ** 2;
      TMP_POSITION.z += introPull * 22;
      TMP_POSITION.y += introPull * 3.5;
    }

    // --- Parallax + ambient float ------------------------------------------
    if (!reducedMotion) {
      const time = performance.now() * 0.001;
      TMP_OFFSET.set(
        mutable.pointerEased.x * 1.15 + Math.sin(time * 0.24) * 0.22,
        mutable.pointerEased.y * 0.7 + Math.cos(time * 0.19) * 0.18,
        0,
      );
      TMP_POSITION.add(TMP_OFFSET);
      TMP_TARGET.x += mutable.pointerEased.x * 0.35;
      TMP_TARGET.y += mutable.pointerEased.y * 0.22;
    }

    // --- Project focus blend ------------------------------------------------
    if (cameraFocus.active && mutable.focusBlend > 0.0005) {
      const blend = MathUtils.smoothstep(mutable.focusBlend, 0, 1);
      TMP_POSITION.lerp(cameraFocus.position, blend);
      TMP_TARGET.lerp(cameraFocus.target, blend);
    }

    camera.position.copy(TMP_POSITION);
    camera.lookAt(TMP_TARGET);

    // A touch of roll through curve corners — the same instinct as banking an
    // aircraft into a turn. Derived from horizontal curve velocity.
    if (!reducedMotion) {
      const ahead = MathUtils.clamp(t + 0.01, 0, 1);
      const behind = MathUtils.clamp(t - 0.01, 0, 1);
      const lateral =
        positionCurve.getPoint(ahead, LOOK_AHEAD).x -
        positionCurve.getPoint(behind, LOOK_BEHIND).x;
      rollRef.current = MathUtils.damp(rollRef.current, -lateral * 0.055, 2, delta);
      camera.rotateZ(rollRef.current);
    }

    // Field of view widens fractionally at speed for a sense of acceleration.
    if (camera instanceof PerspectiveCamera) {
      const speed = Math.abs(mutable.scroll - mutable.scrollEased);
      const targetFov = 46 + MathUtils.clamp(speed * 90, 0, 6);
      if (Math.abs(camera.fov - targetFov) > 0.01) {
        camera.fov = MathUtils.damp(camera.fov, targetFov, 3, delta);
        camera.updateProjectionMatrix();
      }
    }

    invalidate();
  });

  return null;
}
