'use client';

import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, MathUtils, type Group, type Mesh } from 'three';
import { CERTIFICATIONS } from '@/lib/content/career';
import { getUi, setUi, useUi } from '@/lib/store';
import { SceneText } from '../primitives/scene-text';
import { useColor } from '../use-color';
import type { FresnelMaterial } from '../shaders/fresnel-material';
import type { Certification } from '@/types';
import { MAX_FRAME_DELTA } from '@/lib/utils';

const CAPSULE_R = 0.62;
const CAPSULE_H = 2.0;

/**
 * An illuminated glass capsule holding one certificate. Hover spins the
 * capsule; clicking opens the full credential in the DOM overlay.
 */
function Capsule({
  certification,
  index,
  total,
}: {
  certification: Certification;
  index: number;
  total: number;
}) {
  const groupRef = useRef<Group>(null);
  const shellRef = useRef<Mesh>(null);
  const cardRef = useRef<Mesh>(null);
  const materialRef = useRef<InstanceType<typeof FresnelMaterial>>(null);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(0);
  const spinRef = useRef(0);

  const openCertificate = useUi((s) => s.openCertificate);
  const isOpen = openCertificate === certification.id;

  const accent = useColor('#67E8F9');
  const body = useColor('#0B1220');

  const x = (index - (total - 1) / 2) * 1.85;

  const onOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const onOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = '';
  }, []);

  const onClick = useCallback(() => {
    setUi({
      openCertificate: getUi().openCertificate === certification.id ? null : certification.id,
    });
  }, [certification.id]);

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    const time = state.clock.elapsedTime;
    const reduced = getUi().reducedMotion;

    const emphasis = hovered || isOpen ? 1 : 0;
    hoverRef.current = MathUtils.damp(hoverRef.current, emphasis, 6, delta);

    group.position.set(
      x,
      reduced ? 0 : Math.sin(time * 0.45 + index * 0.8) * 0.08 + hoverRef.current * 0.18,
      0,
    );

    // Hover accelerates the capsule's rotation rather than snapping to a speed.
    if (!reduced) {
      spinRef.current += delta * (0.12 + hoverRef.current * 1.5);
      if (shellRef.current) shellRef.current.rotation.y = spinRef.current;
      if (cardRef.current) cardRef.current.rotation.y = spinRef.current * 0.5;
    }

    if (materialRef.current) {
      materialRef.current.uTime = time;
      materialRef.current.uHover = hoverRef.current;
      materialRef.current.uRimStrength = 1.1 + hoverRef.current * 1.5;
    }

    const label = group.getObjectByName('capsule-label');
    if (label) label.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group ref={groupRef} position={[x, 0, 0]}>
      {/* Capsule shell. */}
      <mesh ref={shellRef} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        <capsuleGeometry args={[CAPSULE_R, CAPSULE_H - CAPSULE_R * 2, 6, 18]} />
        <fresnelMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          uColor={body}
          uRimColor={accent}
          uOpacity={0.16}
          uRimPower={2.1}
          uRimStrength={1.1}
        />
      </mesh>

      {/* The certificate itself, suspended inside. */}
      <mesh ref={cardRef}>
        <planeGeometry args={[0.72, 0.98]} />
        <meshStandardMaterial
          color="#111827"
          roughness={0.5}
          metalness={0.2}
          emissive={accent}
          emissiveIntensity={0.22}
          side={2}
        />
      </mesh>

      <SceneText
        variant="display"
        position={[0, 0.16, 0.02]}
        fontSize={0.098}
        color="#FFFFFF"
        maxWidth={0.6}
        textAlign="center"
        lineHeight={1.2}
      >
        {certification.name}
      </SceneText>

      <SceneText
        position={[0, -0.22, 0.02]}
        fontSize={0.052}
        color="#9CA3AF"
        letterSpacing={0.12}
        maxWidth={0.6}
        textAlign="center"
      >
        {certification.focus.toUpperCase()}
      </SceneText>

      {/* Base light pool. */}
      <mesh position={[0, -CAPSULE_H / 2 - 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.78, 24]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.09}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <group name="capsule-label" position={[0, -CAPSULE_H / 2 - 0.45, 0]}>
        <SceneText fontSize={0.1} color="#9CA3AF" maxWidth={1.7} textAlign="center">
          {certification.issuer}
        </SceneText>
      </group>
    </group>
  );
}

/**
 * Certifications environment — a row of lit capsules on a dark plinth. Each
 * one rotates under the cursor and opens on click.
 */
export function CertificationsScene() {
  const accent = useColor('#67E8F9');

  return (
    <group>
      {CERTIFICATIONS.map((certification, index) => (
        <Capsule
          key={certification.id}
          certification={certification}
          index={index}
          total={CERTIFICATIONS.length}
        />
      ))}

      {/* Plinth running the length of the row. */}
      <mesh position={[0, -CAPSULE_H / 2 - 0.2, 0]}>
        <boxGeometry args={[CERTIFICATIONS.length * 1.85 + 0.9, 0.16, 1.6]} />
        <meshStandardMaterial color="#0B1220" roughness={0.35} metalness={0.7} />
      </mesh>

      <pointLight position={[0, -1.0, 1.6]} intensity={14} distance={14} color={accent} />
    </group>
  );
}
