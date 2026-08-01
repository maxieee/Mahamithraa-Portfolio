'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { CatmullRomCurve3, Vector3, type Group, type Mesh } from 'three';
import { PROFILE } from '@/lib/content/profile';
import { getUi } from '@/lib/store';
import { GlassPanel } from '../primitives/glass-panel';
import { SceneText } from '../primitives/scene-text';
import { useColor } from '../use-color';

/** A holographic bar chart whose bars breathe on a slow, offset cycle. */
function HoloBars({ count = 7 }: { count?: number }) {
  const groupRef = useRef<Group>(null);
  const rim = useColor('#67E8F9');
  const body = useColor('#0B1220');

  const heights = useMemo(
    () => Array.from({ length: count }, (_, i) => 0.25 + ((i * 37) % 100) / 130),
    [count],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    group.children.forEach((child, index) => {
      const base = heights[index] ?? 0.5;
      const scale = base * (0.82 + Math.sin(t * 0.8 + index * 0.7) * 0.18);
      child.scale.y = scale;
      // Bars grow from their base rather than their centre.
      child.position.y = scale / 2;
    });
  });

  return (
    <group ref={groupRef}>
      {heights.map((_, index) => (
        <mesh key={index} position={[(index - (count - 1) / 2) * 0.17, 0, 0]}>
          <boxGeometry args={[0.09, 1, 0.02]} />
          <fresnelMaterial
            transparent
            depthWrite={false}
            uColor={body}
            uRimColor={rim}
            uOpacity={0.34}
            uRimPower={1.6}
            uRimStrength={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/** A trend line drawn as a thin tube along a smooth curve. */
function HoloTrend() {
  const meshRef = useRef<Mesh>(null);
  const rim = useColor('#3B82F6');
  const body = useColor('#050816');

  const geometryArgs = useMemo(() => {
    const points = [0.08, 0.22, 0.16, 0.4, 0.34, 0.58, 0.72].map(
      (y, index, array) => new Vector3((index / (array.length - 1) - 0.5) * 1.18, y - 0.36, 0),
    );
    return new CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || getUi().reducedMotion) return;
    mesh.position.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.012;
  });

  return (
    <mesh ref={meshRef}>
      <tubeGeometry args={[geometryArgs, 48, 0.012, 6, false]} />
      <fresnelMaterial
        transparent
        depthWrite={false}
        uColor={body}
        uRimColor={rim}
        uOpacity={0.75}
        uRimPower={1.0}
        uRimStrength={2.0}
      />
    </mesh>
  );
}

/** A floating screen: glass slab + label + a chart widget. */
function HoloScreen({
  position,
  rotation,
  label,
  chart,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
  chart: 'bars' | 'trend' | 'list';
}) {
  return (
    <group position={position} rotation={rotation}>
      <GlassPanel
        position={[0, 0, 0]}
        width={1.9}
        height={1.25}
        depth={0.045}
        opacity={0.26}
        rimColor="#3B82F6"
        float={0.045}
        floatSpeed={0.5}
        floatPhase={position[0] * 2.3}
      />
      <SceneText
        position={[-0.78, 0.44, 0.05]}
        fontSize={0.088}
        color="#9CA3AF"
        anchorX="left"
        letterSpacing={0.09}
      >
        {label.toUpperCase()}
      </SceneText>

      {chart === 'bars' ? (
        <group position={[0, -0.34, 0.05]}>
          <HoloBars />
        </group>
      ) : null}

      {chart === 'trend' ? (
        <group position={[0, 0.02, 0.05]}>
          <HoloTrend />
        </group>
      ) : null}

      {chart === 'list' ? (
        <group position={[-0.78, 0.16, 0.05]}>
          {PROFILE.disciplines.map((item, index) => (
            <SceneText
              key={item}
              position={[0, -index * 0.24, 0]}
              fontSize={0.105}
              color="#FFFFFF"
              anchorX="left"
            >
              {item}
            </SceneText>
          ))}
        </group>
      ) : null}
    </group>
  );
}

/** Stacked documents drifting above the desk. */
function FloatingDocuments() {
  return (
    <group position={[1.85, -0.28, 0.7]}>
      {[0, 1, 2].map((index) => (
        <Float
          key={index}
          speed={0.8 + index * 0.15}
          rotationIntensity={0.14}
          floatIntensity={0.4}
          floatingRange={[-0.06, 0.06]}
        >
          <GlassPanel
            position={[index * 0.14, index * 0.2, -index * 0.16]}
            rotation={[-0.28, 0.36 - index * 0.1, 0.06]}
            width={0.62}
            height={0.82}
            depth={0.014}
            radius={0.006}
            opacity={0.3}
            rimColor="#A5F3FC"
            float={0}
          />
        </Float>
      ))}
    </group>
  );
}

/** Books, stacked flat — the one solid, non-glass object in the workspace. */
function BookStack() {
  const rim = useColor('#3B82F6');

  return (
    <group position={[-1.9, -0.62, 0.5]} rotation={[0, 0.34, 0]}>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[index * 0.02, index * 0.075, 0]} rotation={[0, index * 0.08, 0]}>
          <boxGeometry args={[0.72, 0.068, 0.5]} />
          <meshStandardMaterial
            color="#111827"
            roughness={0.62}
            metalness={0.18}
            emissive={rim}
            emissiveIntensity={0.07}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * About environment — a workspace suspended in space. The camera arcs slowly
 * past it while the DOM overlay carries the readable biography.
 */
export function AboutScene() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || getUi().reducedMotion) return;
    // A very slow rotation reads as the camera circling the desk.
    group.rotation.y = Math.sin(state.clock.elapsedTime * 0.07) * 0.14;
  });

  return (
    <group ref={groupRef}>
      {/* Glass desk surface. */}
      <GlassPanel
        position={[0, -0.85, 0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={5.6}
        height={2.8}
        depth={0.05}
        opacity={0.2}
        rimColor="#3B82F6"
        float={0.03}
        floatSpeed={0.35}
      />

      <HoloScreen position={[0, 0.35, -0.5]} rotation={[0, 0, 0]} label="Focus" chart="list" />
      <HoloScreen
        position={[-1.75, 0.2, 0.1]}
        rotation={[0, 0.5, 0]}
        label="Throughput"
        chart="bars"
      />
      <HoloScreen
        position={[1.75, 0.2, 0.1]}
        rotation={[0, -0.5, 0]}
        label="Trend"
        chart="trend"
      />

      <FloatingDocuments />
      <BookStack />
    </group>
  );
}
