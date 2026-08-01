'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { type DirectionalLight } from 'three';
import { mutable } from '@/lib/store';
import { useColor } from './use-color';

interface LightingRigProps {
  shadows: boolean;
}

/**
 * Global lighting.
 *
 * The environment is built from lightformers rather than an HDRI download —
 * same soft studio falloff, zero network cost, and it renders identically with
 * no external hosts reachable.
 */
export function LightingRig({ shadows }: LightingRigProps) {
  const rimRef = useRef<DirectionalLight>(null);
  const rim = useColor('#3B82F6');
  const glow = useColor('#67E8F9');

  useFrame(() => {
    // The blue rim light tracks the cursor slightly, so moving the mouse
    // changes how the glass edges catch the light.
    const light = rimRef.current;
    if (!light) return;
    light.position.x = -6 + mutable.pointerEased.x * 2.4;
    light.position.y = 5 + mutable.pointerEased.y * 1.6;
  });

  return (
    <>
      <ambientLight intensity={0.28} color="#1E293B" />

      {/* Key: cool, high and soft. */}
      <directionalLight
        position={[6, 9, 6]}
        intensity={1.15}
        color="#DBEAFE"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0004}
      />

      {/* Blue rim from behind-left, separating glass from the background. */}
      <directionalLight ref={rimRef} position={[-6, 5, -8]} intensity={2.1} color={rim} />

      {/* Cyan bounce from below — what gives the panels their cold underglow. */}
      <directionalLight position={[0, -6, 4]} intensity={0.5} color={glow} />

      <Environment resolution={256} frames={1}>
        {/* Broad soft key. */}
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[0, 6, -9]}
          scale={[16, 8, 1]}
          color="#93C5FD"
        />
        {/* Two narrow area lights read as window slots on the glass. */}
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[-8, 2, 4]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[10, 2, 1]}
          color="#3B82F6"
        />
        <Lightformer
          form="rect"
          intensity={2.0}
          position={[8, 1, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[10, 2, 1]}
          color="#67E8F9"
        />
        {/* Dim ring below keeps the underside from going fully black. */}
        <Lightformer
          form="ring"
          intensity={0.7}
          position={[0, -7, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
          color="#1D4ED8"
        />
      </Environment>
    </>
  );
}
