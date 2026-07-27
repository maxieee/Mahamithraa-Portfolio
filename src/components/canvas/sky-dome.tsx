'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { type Mesh } from 'three';
import { useColor } from './use-color';
import { NEBULA_DEFAULTS, type NebulaMaterial } from './shaders/nebula-material';

/**
 * The sky the entire journey happens inside.
 *
 * The dome is parented to the camera each frame so the horizon never runs out,
 * which lets one modest sphere stand in for an infinite sky.
 */
export function SkyDome({ starDensity = 1 }: { starDensity?: number }) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<InstanceType<typeof NebulaMaterial>>(null);
  const camera = useThree((state) => state.camera);

  const top = useColor('#050816');
  const bottom = useColor('#0B1220');
  const nebulaA = useColor('#1D4ED8');
  const nebulaB = useColor('#0E7490');

  useFrame((state) => {
    if (meshRef.current) meshRef.current.position.copy(camera.position);
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} frustumCulled={false} renderOrder={-1000}>
      <sphereGeometry args={[120, 32, 24]} />
      <nebulaMaterial
        ref={materialRef}
        {...NEBULA_DEFAULTS}
        uTop={top}
        uBottom={bottom}
        uNebulaA={nebulaA}
        uNebulaB={nebulaB}
        uIntensity={0.42}
        uStarDensity={starDensity}
      />
    </mesh>
  );
}
