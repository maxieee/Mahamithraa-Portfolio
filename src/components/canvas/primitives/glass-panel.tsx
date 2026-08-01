'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Mesh, type Vector3Tuple } from 'three';
import { RoundedBox } from '@react-three/drei';
import type { FresnelMaterial } from '../shaders/fresnel-material';
import { useColor } from '../use-color';
import { MAX_FRAME_DELTA } from '@/lib/utils';

interface GlassPanelProps {
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  width?: number;
  height?: number;
  depth?: number;
  radius?: number;
  color?: string;
  rimColor?: string;
  opacity?: number;
  hovered?: boolean;
  /** Amplitude of the idle vertical float, in world units. */
  float?: number;
  floatSpeed?: number;
  floatPhase?: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * The base surface of the whole world: a rounded glass slab with a fresnel rim
 * and an optional travelling light sweep on hover.
 */
export function GlassPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 3,
  height = 2,
  depth = 0.08,
  radius = 0.06,
  color = '#0B1220',
  rimColor = '#3B82F6',
  opacity = 0.34,
  hovered = false,
  float = 0.08,
  floatSpeed = 0.6,
  floatPhase,
  onClick,
  onPointerOver,
  onPointerOut,
}: GlassPanelProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<InstanceType<typeof FresnelMaterial>>(null);
  const hoverRef = useRef(0);
  const sweepRef = useRef(-height);

  const baseColor = useColor(color);
  const rim = useColor(rimColor);

  const phase = useMemo(
    () => floatPhase ?? Math.abs(position[0] * 1.7 + position[1] * 0.9 + position[2] * 0.4),
    [floatPhase, position],
  );

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    const time = state.clock.elapsedTime;

    hoverRef.current = MathUtils.damp(hoverRef.current, hovered ? 1 : 0, 6, delta);

    const mesh = meshRef.current;
    if (mesh) {
      mesh.position.y = position[1] + Math.sin(time * floatSpeed + phase) * float;
      // Hover lifts the panel toward the viewer along its own normal.
      mesh.position.z = position[2] + hoverRef.current * 0.24;
    }

    const material = materialRef.current;
    if (material) {
      material.uTime = time;
      material.uHover = hoverRef.current;
      // Sweep travels bottom-to-top once per hover cycle, then parks below.
      if (hovered) {
        sweepRef.current += delta * height * 1.6;
        if (sweepRef.current > height) sweepRef.current = -height;
      } else {
        sweepRef.current = -height;
      }
      material.uSweep = sweepRef.current;
    }
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[width, height, depth]}
      radius={Math.min(radius, depth / 2, width / 2, height / 2)}
      smoothness={4}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <fresnelMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uColor={baseColor}
        uRimColor={rim}
        uOpacity={opacity}
        uRimPower={2.6}
        uRimStrength={1.05}
        uSweepWidth={Math.max(0.18, height * 0.14)}
      />
    </RoundedBox>
  );
}
