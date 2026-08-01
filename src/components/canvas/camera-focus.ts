import gsap from 'gsap';
import { Vector3 } from 'three';
import { mutable } from '@/lib/store';

/**
 * Imperative focus channel between scene objects and the camera rig.
 *
 * A scene (e.g. a project monolith) requests focus with a world position and
 * look-at target; the rig blends the free-flight path toward it using
 * `mutable.focusBlend`, which GSAP tweens. Nothing here triggers a React
 * render — the rig reads these values inside `useFrame`.
 */
export const cameraFocus = {
  position: new Vector3(),
  target: new Vector3(),
  active: false,
};

let tween: gsap.core.Tween | null = null;

export function focusCamera(position: Vector3, target: Vector3, duration = 1.6) {
  cameraFocus.position.copy(position);
  cameraFocus.target.copy(target);
  cameraFocus.active = true;

  tween?.kill();
  tween = gsap.to(mutable, {
    focusBlend: 1,
    duration,
    ease: 'power3.out',
    overwrite: true,
  });
}

export function releaseCamera(duration = 1.3) {
  tween?.kill();
  tween = gsap.to(mutable, {
    focusBlend: 0,
    duration,
    ease: 'power3.inOut',
    overwrite: true,
    onComplete: () => {
      cameraFocus.active = false;
    },
  });
}
