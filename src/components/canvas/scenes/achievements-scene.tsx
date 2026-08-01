'use client';

import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  MathUtils,
  Vector2,
  type Group,
  type Mesh,
  type PointLight,
} from 'three';
import { ACHIEVEMENTS } from '@/lib/content/career';
import { getUi } from '@/lib/store';
import { SceneText } from '../primitives/scene-text';
import { useColor } from '../use-color';
import type { Achievement } from '@/types';
import { MAX_FRAME_DELTA } from '@/lib/utils';

/** Half-profile of a trophy cup, revolved by the lathe geometry. */
const CUP_PROFILE = [
  [0.0, -0.5],
  [0.34, -0.5],
  [0.34, -0.44],
  [0.12, -0.38],
  [0.1, -0.1],
  [0.34, 0.1],
  [0.4, 0.42],
  [0.38, 0.46],
  [0.0, 0.46],
].map(([x, y]) => new Vector2(x, y));

/** Each award gets a distinct silhouette so the room reads at a glance. */
function TrophyGeometry({ form }: { form: Achievement['form'] }) {
  switch (form) {
    case 'cup':
      return <latheGeometry args={[CUP_PROFILE, 24]} />;
    case 'star':
      return <dodecahedronGeometry args={[0.42, 0]} />;
    case 'ring':
      return <torusGeometry args={[0.36, 0.1, 12, 40]} />;
    case 'obelisk':
    default:
      return <coneGeometry args={[0.34, 1.0, 4]} />;
  }
}

function Trophy({
  achievement,
  index,
  total,
}: {
  achievement: Achievement;
  index: number;
  total: number;
}) {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(0);

  const accent = useColor(index % 2 === 0 ? '#3B82F6' : '#67E8F9');

  const angle = (index / total) * Math.PI * 2;
  const radius = 2.9;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const onOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const onOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = '';
  }, []);

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    const time = state.clock.elapsedTime;
    const reduced = getUi().reducedMotion;

    hoverRef.current = MathUtils.damp(hoverRef.current, hovered ? 1 : 0, 6, delta);

    group.position.set(
      x,
      (reduced ? 0 : Math.sin(time * 0.5 + index * 1.7) * 0.11) + hoverRef.current * 0.24,
      z,
    );

    if (bodyRef.current && !reduced) {
      bodyRef.current.rotation.y = time * (0.18 + hoverRef.current * 0.6) + index;
    }

    if (lightRef.current) {
      // Each award has its own slow breathing key light.
      lightRef.current.intensity =
        2.2 + Math.sin(time * 0.9 + index * 2.1) * 0.8 + hoverRef.current * 4;
    }

    const label = group.getObjectByName('trophy-label');
    if (label) {
      label.quaternion.copy(state.camera.quaternion);
      label.position.y = 1.0 + hoverRef.current * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <mesh ref={bodyRef} onPointerOver={onOver} onPointerOut={onOut} position={[0, 0.42, 0]}>
        <TrophyGeometry form={achievement.form} />
        <meshStandardMaterial
          color="#111827"
          roughness={0.18}
          metalness={0.94}
          emissive={accent}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Plinth. */}
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.5, 0.58, 0.14, 24]} />
        <meshStandardMaterial color="#0B1220" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Light pool. */}
      <mesh position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 24]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight ref={lightRef} position={[0, 1.5, 0.6]} distance={5} color={accent} intensity={2.2} />

      <group name="trophy-label" position={[0, 1.0, 0]}>
        <SceneText variant="display" fontSize={0.17} color="#FFFFFF" maxWidth={2.4} textAlign="center">
          {achievement.title}
        </SceneText>
        <SceneText
          position={[0, -0.26, 0]}
          fontSize={0.083}
          color="#9CA3AF"
          letterSpacing={0.11}
          maxWidth={2.4}
          textAlign="center"
        >
          {achievement.context.toUpperCase()}
        </SceneText>
      </group>
    </group>
  );
}

/**
 * Achievements environment — a circular trophy room. The camera looks in from
 * outside the ring while each award turns under its own light.
 */
export function AchievementsScene() {
  const groupRef = useRef<Group>(null);
  const floor = useColor('#3B82F6');

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || getUi().reducedMotion) return;
    group.rotation.y = state.clock.elapsedTime * 0.045;
  });

  return (
    <group>
      <group ref={groupRef}>
        {ACHIEVEMENTS.map((achievement, index) => (
          <Trophy
            key={achievement.id}
            achievement={achievement}
            index={index}
            total={ACHIEVEMENTS.length}
          />
        ))}
      </group>

      {/* Floor disc tying the ring together. */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 4.3, 64]} />
        <meshBasicMaterial color={floor} transparent opacity={0.05} depthWrite={false} />
      </mesh>

      <ambientLight intensity={0.35} />
    </group>
  );
}
