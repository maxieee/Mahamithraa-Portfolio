'use client';

import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, MathUtils, type Group, type Mesh } from 'three';
import { EXPERIENCE } from '@/lib/content/career';
import { getUi } from '@/lib/store';
import { GlassPanel } from '../primitives/glass-panel';
import { SceneText } from '../primitives/scene-text';
import { useColor } from '../use-color';
import type { ExperienceEntry } from '@/types';
import { MAX_FRAME_DELTA } from '@/lib/utils';

const CARD_W = 3.1;
const CARD_H = 1.85;
const GAP = 2.6;

/** A suspended timeline card. Hovering reveals the achievement list. */
function TimelineCard({
  entry,
  index,
  total,
}: {
  entry: ExperienceEntry;
  index: number;
  total: number;
}) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(0);

  const y = (total - 1 - index) * GAP - ((total - 1) * GAP) / 2;
  const x = index % 2 === 0 ? -0.55 : 0.55;

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

    hoverRef.current = MathUtils.damp(hoverRef.current, hovered ? 1 : 0, 6, delta);

    const drift = getUi().reducedMotion ? 0 : Math.sin(time * 0.42 + index * 1.4) * 0.07;
    group.position.set(x, y + drift, hoverRef.current * 0.5);
    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      (index % 2 === 0 ? 0.18 : -0.18) * (1 - hoverRef.current),
      4,
      delta,
    );

    const reveal = group.getObjectByName('achievements');
    if (reveal) {
      reveal.scale.setScalar(0.85 + hoverRef.current * 0.15);
      reveal.visible = hoverRef.current > 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[x, y, 0]}>
      <group onPointerOver={onOver} onPointerOut={onOut}>
        <GlassPanel
          width={CARD_W}
          height={CARD_H}
          depth={0.07}
          opacity={0.26}
          rimColor="#3B82F6"
          hovered={hovered}
          float={0}
        />
      </group>

      <SceneText
        variant="display"
        position={[-CARD_W / 2 + 0.2, CARD_H / 2 - 0.36, 0.06]}
        fontSize={0.21}
        color="#FFFFFF"
        anchorX="left"
        maxWidth={CARD_W - 0.5}
      >
        {entry.role}
      </SceneText>

      <SceneText
        position={[-CARD_W / 2 + 0.2, CARD_H / 2 - 0.66, 0.06]}
        fontSize={0.115}
        color="#3B82F6"
        anchorX="left"
        maxWidth={CARD_W - 0.5}
      >
        {entry.company}
      </SceneText>

      <SceneText
        position={[CARD_W / 2 - 0.2, CARD_H / 2 - 0.36, 0.06]}
        fontSize={0.095}
        color="#9CA3AF"
        anchorX="right"
        letterSpacing={0.09}
      >
        {entry.period.toUpperCase()}
      </SceneText>

      {/* Summary, replaced by the achievement list on hover. */}
      <SceneText
        position={[-CARD_W / 2 + 0.2, -0.16, 0.06]}
        fontSize={0.095}
        color="#9CA3AF"
        anchorX="left"
        anchorY="top"
        lineHeight={1.5}
        maxWidth={CARD_W - 0.42}
        fillOpacity={hovered ? 0.15 : 0.9}
      >
        {entry.summary}
      </SceneText>

      <group name="achievements" position={[-CARD_W / 2 + 0.2, -0.16, 0.09]} visible={false}>
        {entry.achievements.map((achievement, i) => (
          <SceneText
            key={achievement}
            position={[0, -i * 0.29, 0]}
            fontSize={0.082}
            color="#FFFFFF"
            anchorX="left"
            anchorY="top"
            lineHeight={1.42}
            maxWidth={CARD_W - 0.42}
          >
            {`— ${achievement}`}
          </SceneText>
        ))}
      </group>
    </group>
  );
}

/** The animated spine linking the cards together. */
function Connectors({ total }: { total: number }) {
  const groupRef = useRef<Group>(null);
  const height = (total - 1) * GAP + CARD_H;

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    group.children.forEach((child, index) => {
      const mesh = child as Mesh;
      const material = mesh.material as { opacity?: number };
      if (typeof material?.opacity === 'number') {
        material.opacity = 0.18 + Math.sin(t * 1.1 - index * 0.9) ** 2 * 0.42;
      }
    });
  });

  return (
    <group>
      {/* Spine. */}
      <mesh>
        <boxGeometry args={[0.012, height, 0.012]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.25} depthWrite={false} />
      </mesh>

      {/* Pulsing joints, one per card. */}
      <group ref={groupRef}>
        {Array.from({ length: total }, (_, index) => {
          const y = (total - 1 - index) * GAP - ((total - 1) * GAP) / 2;
          return (
            <mesh key={index} position={[0, y, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial
                color="#67E8F9"
                transparent
                opacity={0.3}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/**
 * Experience environment — a vertical glass timeline with cards suspended
 * either side of a pulsing spine. Hovering a card swaps its summary for the
 * achievements behind it.
 */
export function ExperienceScene() {
  const accent = useColor('#3B82F6');

  return (
    <group>
      <Connectors total={EXPERIENCE.length} />
      {EXPERIENCE.map((entry, index) => (
        <TimelineCard key={entry.id} entry={entry} index={index} total={EXPERIENCE.length} />
      ))}
      <pointLight position={[0, 0, 3]} intensity={12} distance={14} color={accent} />
    </group>
  );
}
