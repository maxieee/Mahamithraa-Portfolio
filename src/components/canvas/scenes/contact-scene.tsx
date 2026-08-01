'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, MathUtils, type Group, type Mesh } from 'three';
import { PROFILE } from '@/lib/content/profile';
import { getUi, mutable } from '@/lib/store';
import { SECTION_BY_ID, sectionProgress } from '@/lib/content/sections';
import { GlassPanel } from '../primitives/glass-panel';
import { SceneText } from '../primitives/scene-text';
import { useColor } from '../use-color';
import { MAX_FRAME_DELTA, clamp, inverseLerp } from '@/lib/utils';
import type { FloorGridMaterial } from '../shaders/grid-material';

/** The platform the contact section rests on. */
function Platform() {
  const materialRef = useRef<InstanceType<typeof FloorGridMaterial>>(null);
  const line = useColor('#3B82F6');
  const glow = useColor('#67E8F9');

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime;
  });

  return (
    <group position={[0, -1.6, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial
          color="#0B1220"
          roughness={0.24}
          metalness={0.72}
          transparent
          opacity={0.72}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[9, 64]} />
        <floorGridMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          uColor={line}
          uGlowColor={glow}
          uScale={1.4}
          uFade={9}
          uOpacity={0.4}
          uScanSpeed={0.35}
        />
      </mesh>

      {/* Rim light around the platform edge. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[8.7, 9, 96]} />
        <meshBasicMaterial
          color={glow}
          transparent
          opacity={0.32}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * The contact console rises out of the platform as the camera settles into the
 * section — driven directly by scroll progress rather than a timer, so the
 * motion always matches where the user actually is.
 */
function RisingConsole() {
  const groupRef = useRef<Group>(null);
  const riseRef = useRef(0);

  useFrame((_, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);

    const start = sectionProgress(SECTION_BY_ID.contact.index - 0.9);
    const end = sectionProgress(SECTION_BY_ID.contact.index - 0.15);
    const target = clamp(inverseLerp(start, end, mutable.scrollEased));

    riseRef.current = MathUtils.damp(riseRef.current, target, 3.4, delta);

    // Rises clear of the DOM contact card that sits in front of it.
    group.position.y = -1.6 + riseRef.current * 3.4;
    group.scale.setScalar(0.8 + riseRef.current * 0.2);
    group.visible = riseRef.current > 0.02;
  });

  return (
    <group ref={groupRef}>
      <GlassPanel
        width={5.4}
        height={2.6}
        depth={0.09}
        opacity={0.24}
        rimColor="#3B82F6"
        float={0.05}
        floatSpeed={0.4}
      />

      <SceneText
        variant="display"
        position={[0, 0.62, 0.07]}
        fontSize={0.34}
        color="#FFFFFF"
        maxWidth={4.6}
        textAlign="center"
      >
        Let&rsquo;s build something
      </SceneText>

      <SceneText
        position={[0, 0.12, 0.07]}
        fontSize={0.13}
        color="#9CA3AF"
        maxWidth={4.4}
        textAlign="center"
        lineHeight={1.5}
      >
        {PROFILE.availability}
      </SceneText>

      <SceneText
        position={[0, -0.62, 0.07]}
        fontSize={0.115}
        color="#67E8F9"
        letterSpacing={0.14}
        maxWidth={4.6}
        textAlign="center"
      >
        THINK. SOLVE. LEAD.
      </SceneText>
    </group>
  );
}

/** A slow ring of light orbiting the platform — the room's only movement. */
function OrbitRing() {
  const meshRef = useRef<Mesh>(null);
  const glow = useColor('#3B82F6');

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || getUi().reducedMotion) return;
    const t = state.clock.elapsedTime;
    mesh.rotation.z = t * 0.06;
    mesh.rotation.x = -Math.PI / 2 + Math.sin(t * 0.15) * 0.12;
  });

  return (
    <mesh ref={meshRef} position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[6.4, 0.014, 8, 128]} />
      <meshBasicMaterial
        color={glow}
        transparent
        opacity={0.4}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Contact environment — a calm platform under open sky. The console emerges
 * from the floor on approach; the working form lives in the DOM overlay.
 */
export function ContactScene() {
  const key = useColor('#3B82F6');
  const fill = useColor('#67E8F9');

  return (
    <group>
      <Platform />
      <OrbitRing />
      <RisingConsole />

      <pointLight position={[0, 3.2, 3.4]} intensity={26} distance={22} color={key} />
      <pointLight position={[-4, 1.2, -3]} intensity={14} distance={18} color={fill} />
    </group>
  );
}
