'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group, type Material, type Mesh, type Vector3Tuple } from 'three';
import { useUi } from '@/lib/store';
import { MAX_FRAME_DELTA } from '@/lib/utils';

interface SceneGateProps {
  index: number;
  origin: Vector3Tuple;
  /** Y rotation that turns the environment's front toward its camera. */
  facing: number;
  children: ReactNode;
  /** How many sections either side stay mounted. */
  range?: number;
  name?: string;
}

/** Base opacity per material, captured the first time we touch it. */
const baseOpacity = new WeakMap<Material, number>();

function applyFade(group: Group, factor: number) {
  group.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.material) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (!material.transparent) continue;
      let base = baseOpacity.get(material);
      if (base === undefined) {
        base = material.opacity;
        baseOpacity.set(material, base);
      }
      material.opacity = base * factor;
    }
  });
}

/**
 * Mounts an environment only while the camera is near it, and fades its
 * contents on the way in and out.
 *
 * This is the single biggest performance lever in the project: without it every
 * scene's geometry, materials and per-frame work would be live at all times.
 * With it, at most three environments are ever being simulated.
 */
export function SceneGate({ index, origin, facing, children, range = 1, name }: SceneGateProps) {
  const activeIndex = useUi((s) => s.activeIndex);
  const groupRef = useRef<Group>(null);
  const opacityRef = useRef(0);

  const within = Math.abs(activeIndex - index) <= range;
  const [mounted, setMounted] = useState(within);

  useEffect(() => {
    if (within) setMounted(true);
  }, [within]);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);

    const target = within ? 1 : 0;
    const previous = opacityRef.current;
    opacityRef.current = MathUtils.damp(previous, target, 2.6, delta);

    // Environments settle into place as they fade in — a very slight rise, so
    // arriving at a section feels like the space assembling around you.
    const settle = 1 - opacityRef.current;
    group.position.set(origin[0], origin[1] - settle * 1.4, origin[2]);
    group.scale.setScalar(0.96 + opacityRef.current * 0.04);
    group.visible = opacityRef.current > 0.012;

    // Only walk the object graph while the fade is actually in flight.
    if (Math.abs(opacityRef.current - 1) > 0.004 || Math.abs(previous - 1) > 0.004) {
      applyFade(group, opacityRef.current);
    }

    // Unmounting (rather than merely hiding) is what frees the GPU memory, so
    // request the render that drops the subtree once the fade has finished.
    if (!within && mounted && opacityRef.current <= 0.012) {
      setMounted(false);
    }
  });

  return (
    <group ref={groupRef} name={name} position={origin} rotation={[0, facing, 0]}>
      {mounted ? children : null}
    </group>
  );
}
