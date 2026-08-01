'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, MathUtils, type Group, type Mesh } from 'three';
import { MILESTONES } from '@/lib/content/career';
import { getUi, mutable } from '@/lib/store';
import { SECTION_BY_ID, sectionProgress } from '@/lib/content/sections';
import { SceneText } from '../primitives/scene-text';
import { useColor } from '../use-color';
import { MAX_FRAME_DELTA, clamp, inverseLerp } from '@/lib/utils';
import type { FresnelMaterial } from '../shaders/fresnel-material';
import type { Milestone } from '@/types';

const SPAN = 4.4;

/** Local Z of a milestone — the bridge runs away from the camera. */
function milestoneZ(index: number): number {
  return -index * SPAN;
}

/**
 * A milestone crystal. It lights up as the camera reaches its position along
 * the bridge, so walking forward genuinely advances the timeline.
 */
function Crystal({ milestone, index }: { milestone: Milestone; index: number }) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  const materialRef = useRef<InstanceType<typeof FresnelMaterial>>(null);
  const litRef = useRef(0);

  const accent = useColor(milestone.future ? '#9CA3AF' : '#3B82F6');
  const body = useColor('#050816');

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    const time = state.clock.elapsedTime;

    // Section-local progress: 0 when the camera arrives at leadership, 1 when
    // it leaves for the next section.
    const start = sectionProgress(SECTION_BY_ID.leadership.index - 0.5);
    const end = sectionProgress(SECTION_BY_ID.leadership.index + 0.5);
    const local = clamp(inverseLerp(start, end, mutable.scrollEased));
    const walk = local * (MILESTONES.length - 1);

    // Each crystal lights when the walk position passes it.
    const target = clamp(inverseLerp(index - 0.85, index - 0.1, walk));
    litRef.current = MathUtils.damp(litRef.current, target, 4, delta);

    const reduced = getUi().reducedMotion;
    group.position.y = reduced ? 0 : Math.sin(time * 0.5 + index * 1.1) * 0.09;

    if (coreRef.current) {
      if (!reduced) coreRef.current.rotation.y = time * 0.22 + index;
      coreRef.current.scale.setScalar(0.82 + litRef.current * 0.24);
    }
    if (haloRef.current) {
      const material = haloRef.current.material as { opacity: number };
      material.opacity = 0.03 + litRef.current * 0.16;
      haloRef.current.scale.setScalar(1 + litRef.current * 0.5);
    }
    if (materialRef.current) {
      materialRef.current.uTime = time;
      materialRef.current.uHover = litRef.current;
      materialRef.current.uRimStrength = 0.7 + litRef.current * 2.1;
      materialRef.current.uOpacity = milestone.future ? 0.1 : 0.2 + litRef.current * 0.22;
    }

    const label = group.getObjectByName('crystal-label');
    if (label) label.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group ref={groupRef} position={[0, 0, milestoneZ(index)]}>
      <mesh ref={coreRef} position={[0, 1.15, 0]}>
        <octahedronGeometry args={[0.52, 0]} />
        <fresnelMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          uColor={body}
          uRimColor={accent}
          uOpacity={0.2}
          uRimPower={1.9}
          uRimStrength={0.7}
          wireframe={milestone.future}
        />
      </mesh>

      <mesh ref={haloRef} position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.95, 16, 16]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.03}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Plinth. */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.62, 0.72, 0.09, 6]} />
        <meshStandardMaterial
          color="#0B1220"
          roughness={0.4}
          metalness={0.55}
          emissive={accent}
          emissiveIntensity={0.16}
        />
      </mesh>

      <group name="crystal-label" position={[0, 2.15, 0]}>
        <SceneText variant="display" fontSize={0.24} color="#FFFFFF" maxWidth={3.4} textAlign="center">
          {milestone.title}
        </SceneText>
        <SceneText
          position={[0, -0.32, 0]}
          fontSize={0.115}
          color="#9CA3AF"
          letterSpacing={0.08}
          maxWidth={3.6}
          textAlign="center"
        >
          {milestone.organisation.toUpperCase()}
        </SceneText>
      </group>
    </group>
  );
}

/** The bridge deck itself, with railings that glow along its length. */
function BridgeDeck() {
  const length = (MILESTONES.length - 1) * SPAN + 6;
  const accent = useColor('#3B82F6');
  const body = useColor('#0B1220');
  const railRef = useRef<Group>(null);

  useFrame((state) => {
    const group = railRef.current;
    if (!group) return;
    group.children.forEach((child) => {
      const material = (child as Mesh).material as InstanceType<typeof FresnelMaterial>;
      if (material?.uRimStrength !== undefined) {
        material.uTime = state.clock.elapsedTime;
      }
    });
  });

  return (
    <group position={[0, -0.2, -((MILESTONES.length - 1) * SPAN) / 2 + 1]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, length]} />
        <meshStandardMaterial
          color="#0B1220"
          roughness={0.32}
          metalness={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>

      <group ref={railRef}>
        {[-1.3, 1.3].map((x) => (
          <mesh key={x} position={[x, 0.18, 0]}>
            <boxGeometry args={[0.035, 0.035, length]} />
            <fresnelMaterial
              transparent
              depthWrite={false}
              uColor={body}
              uRimColor={accent}
              uOpacity={0.6}
              uRimPower={1.0}
              uRimStrength={1.7}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Leadership environment — the career timeline rendered as a bridge you walk
 * along. Crystals ignite in sequence as the camera advances.
 */
export function LeadershipScene() {
  return (
    <group>
      <BridgeDeck />
      {MILESTONES.map((milestone, index) => (
        <Crystal key={milestone.id} milestone={milestone} index={index} />
      ))}
    </group>
  );
}
