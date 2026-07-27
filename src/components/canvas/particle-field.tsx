'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, Vector3, type Points } from 'three';
import { mutable } from '@/lib/store';
import { useColor } from './use-color';
import type { ParticleMaterial } from './shaders/particle-material';

interface ParticleFieldProps {
  count: number;
  /** Half-extents of the box the particles fill. */
  bounds?: [number, number, number];
  center?: [number, number, number];
  size?: number;
  colorA?: string;
  colorB?: string;
  opacity?: number;
  drift?: number;
}

const POINTER_WORLD = new Vector3();

/**
 * The ambient dust that ties every environment together. One draw call; all
 * motion, cursor response and twinkle live in the vertex/fragment shaders.
 */
export function ParticleField({
  count,
  bounds = [70, 34, 90],
  center = [0, 0, -50],
  size = 9,
  colorA = '#3B82F6',
  colorB = '#67E8F9',
  opacity = 1,
  drift = 1,
}: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<InstanceType<typeof ParticleMaterial>>(null);
  const camera = useThree((state) => state.camera);
  const dpr = useThree((state) => state.viewport.dpr);

  const tintA = useColor(colorA);
  const tintB = useColor(colorB);

  const attributes = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // Bias toward the centre of each axis so the field has a visible core
      // and thins out at the edges rather than reading as a uniform box.
      const bias = () => (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
      positions[i * 3] = center[0] + bias() * bounds[0] * 2;
      positions[i * 3 + 1] = center[1] + bias() * bounds[1] * 2;
      positions[i * 3 + 2] = center[2] + bias() * bounds[2] * 2;

      scales[i] = 0.35 + Math.random() ** 2.2 * 1.5;
      seeds[i] = Math.random() * 100;
    }

    return {
      position: new BufferAttribute(positions, 3),
      aScale: new BufferAttribute(scales, 1),
      aSeed: new BufferAttribute(seeds, 1),
    };
  }, [count, bounds, center]);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;

    material.uTime = state.clock.elapsedTime;
    material.uPixelRatio = dpr;

    // Project the cursor a fixed distance in front of the camera so particles
    // part around where the user is actually pointing in the world.
    POINTER_WORLD.set(mutable.pointerEased.x, mutable.pointerEased.y, 0.5)
      .unproject(camera)
      .sub(camera.position)
      .normalize()
      .multiplyScalar(14)
      .add(camera.position);
    material.uPointer.copy(POINTER_WORLD);
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={attributes.position} />
        <primitive attach="attributes-aScale" object={attributes.aScale} />
        <primitive attach="attributes-aSeed" object={attributes.aSeed} />
      </bufferGeometry>
      <particleMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uSize={size}
        uColorA={tintA}
        uColorB={tintB}
        uOpacity={opacity}
        uDrift={drift}
      />
    </points>
  );
}
