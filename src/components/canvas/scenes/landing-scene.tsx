'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { MathUtils, type Group, type Mesh } from 'three';
import { PROFILE } from '@/lib/content/profile';
import { getUi } from '@/lib/store';
import { MAX_FRAME_DELTA } from '@/lib/utils';
import { GlassPanel } from '../primitives/glass-panel';
import { SceneText } from '../primitives/scene-text';
import { useColor } from '../use-color';
import type { FloorGridMaterial } from '../shaders/grid-material';
import type { FresnelMaterial } from '../shaders/fresnel-material';

/** Resting height of the 3D headline, clear of the DOM copy beneath it. */
const TITLE_Y = 3.9;

/** Minimal architecture: slender pylons framing the approach to the title. */
function Pylons() {
  const groupRef = useRef<Group>(null);
  const rim = useColor('#3B82F6');
  const body = useColor('#050816');

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || getUi().reducedMotion) return;
    group.children.forEach((child, index) => {
      child.position.y = -3 + Math.sin(state.clock.elapsedTime * 0.35 + index * 0.9) * 0.14;
    });
  });

  const columns = [-9.5, -7.2, 7.2, 9.5];

  return (
    <group ref={groupRef}>
      {columns.map((x, index) => (
        <mesh key={x} position={[x, -3, -9 - index * 1.6]}>
          <cylinderGeometry args={[0.07, 0.07, 15, 6, 1, true]} />
          <fresnelMaterial
            transparent
            depthWrite={false}
            uColor={body}
            uRimColor={rim}
            uOpacity={0.1}
            uRimPower={1.5}
            uRimStrength={1.0}
          />
        </mesh>
      ))}
    </group>
  );
}

/** The animated ground plane the whole entry sits on. */
function GroundGrid() {
  const materialRef = useRef<InstanceType<typeof FloorGridMaterial>>(null);
  const line = useColor('#3B82F6');
  const glow = useColor('#67E8F9');

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.4, -14]}>
      <planeGeometry args={[120, 120, 1, 1]} />
      <floorGridMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uColor={line}
        uGlowColor={glow}
        // Wide cells and a low opacity: the floor should suggest ground, not
        // become the subject. A dense bright grid reads as retro, not calm.
        uScale={6.5}
        uFade={54}
        uOpacity={0.1}
        uScanSpeed={0.22}
      />
    </mesh>
  );
}

/** Two dim guide rails receding toward the title — a runway, barely lit. */
function GuideLines() {
  const groupRef = useRef<Group>(null);
  const glow = useColor('#67E8F9');
  const body = useColor('#0B1220');

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    group.children.forEach((child, index) => {
      const mesh = child as Mesh;
      const material = mesh.material as InstanceType<typeof FresnelMaterial>;
      if (material?.uRimStrength !== undefined) {
        material.uRimStrength = 0.5 + Math.sin(t * 0.6 + index * 1.6) * 0.22;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {[-5.2, 5.2].map((x) => (
        <mesh key={x} position={[x, -5.36, -14]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 46]} />
          <fresnelMaterial
            transparent
            depthWrite={false}
            uColor={body}
            uRimColor={glow}
            uOpacity={0.22}
            uRimPower={1.0}
            uRimStrength={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Landing environment — floating architecture, a glowing floor and the
 * three-word headline the camera flies toward on load.
 */
export function LandingScene() {
  const titleRef = useRef<Group>(null);

  useFrame((state, rawDelta) => {
    const group = titleRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    if (getUi().reducedMotion) return;
    // The headline drifts a fraction against the camera parallax, which reads
    // as depth between the words and the architecture behind them. Drift is
    // applied around TITLE_Y — damping toward the raw sine would drag the
    // whole headline down to the origin on the first frame.
    const t = state.clock.elapsedTime;
    group.position.y = MathUtils.damp(
      group.position.y,
      TITLE_Y + Math.sin(t * 0.4) * 0.09,
      3,
      delta,
    );
  });

  return (
    <group>
      <GroundGrid />
      <GuideLines />
      <Pylons />

      {/* Headline — rendered in 3D for the fly-toward moment. The accessible
          copy lives in the DOM overlay, so this is decorative. */}
      <group ref={titleRef} position={[0, TITLE_Y, -1]}>
        {PROFILE.headline.map((word, index) => (
          <Float
            key={word}
            speed={1.1}
            rotationIntensity={0.06}
            floatIntensity={0.24}
            floatingRange={[-0.05, 0.05]}
          >
            <SceneText
              variant="display"
              position={[0, 1.35 - index * 1.26, index * -0.35]}
              fontSize={1.02}
              letterSpacing={-0.045}
              color="#FFFFFF"
              outlineWidth={0.004}
              outlineColor="#3B82F6"
              outlineOpacity={0.5}
            >
              {word}
            </SceneText>
          </Float>
        ))}
      </group>

      {/* Floating glass slabs framing the title. */}
      <GlassPanel
        position={[-5.4, 2.2, -3.2]}
        rotation={[0, 0.42, 0.05]}
        width={2.4}
        height={3.4}
        opacity={0.13}
        float={0.14}
        floatSpeed={0.44}
      />
      <GlassPanel
        position={[5.4, 1.9, -3.6]}
        rotation={[0, -0.42, -0.05]}
        width={2.4}
        height={3.4}
        opacity={0.13}
        float={0.14}
        floatSpeed={0.5}
        floatPhase={2.1}
      />
    </group>
  );
}
