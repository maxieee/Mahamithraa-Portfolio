'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { MathUtils, Vector3, type Group, type Mesh } from 'three';
import { PROJECTS } from '@/lib/content/projects';
import { getUi, setUi, useUi } from '@/lib/store';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { focusCamera, releaseCamera } from '../camera-focus';
import { SceneText } from '../primitives/scene-text';
import { useColor } from '../use-color';
import type { FresnelMaterial } from '../shaders/fresnel-material';
import type { Project } from '@/types';
import { MAX_FRAME_DELTA } from '@/lib/utils';

const MONOLITH_WIDTH = 1.9;
const MONOLITH_HEIGHT = 4.2;
const MONOLITH_DEPTH = 0.24;

/** Local X position of each monolith in the gallery line-up. */
function slotX(index: number, total: number): number {
  return (index - (total - 1) / 2) * 2.9;
}

const WORLD_POSITION = new Vector3();
const FOCUS_POSITION = new Vector3();
/** Where the camera parks relative to a monolith when it is opened. */
const FOCUS_OFFSET = new Vector3(0, 0.35, 4.6);

function Monolith({ project, index, total }: { project: Project; index: number; total: number }) {
  const groupRef = useRef<Group>(null);
  const slabRef = useRef<Mesh>(null);
  const materialRef = useRef<InstanceType<typeof FresnelMaterial>>(null);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(0);
  const sweepRef = useRef(-MONOLITH_HEIGHT);

  const openProject = useUi((s) => s.openProject);
  const isOpen = openProject === project.id;
  const isDimmed = openProject !== null && !isOpen;

  const accent = useColor(project.accent);
  const body = useColor('#0B1220');

  const x = useMemo(() => slotX(index, total), [index, total]);
  const z = useMemo(() => (index % 2 === 0 ? 0 : -0.9), [index]);

  const onOver = useCallback(() => {
    if (getUi().openProject) return;
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const onOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = '';
  }, []);

  const onClick = useCallback(() => {
    const group = groupRef.current;
    if (!group) return;

    if (getUi().openProject === project.id) {
      setUi({ openProject: null });
      releaseCamera();
      return;
    }

    // Fly to a point just in front of this monolith, in world space.
    group.getWorldPosition(WORLD_POSITION);
    FOCUS_POSITION.copy(WORLD_POSITION).add(FOCUS_OFFSET);
    focusCamera(FOCUS_POSITION, WORLD_POSITION, 1.5);
    setUi({ openProject: project.id });
    setHovered(false);
    document.body.style.cursor = '';
  }, [project.id]);

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    const time = state.clock.elapsedTime;
    const reduced = getUi().reducedMotion;

    const emphasis = hovered || isOpen ? 1 : 0;
    hoverRef.current = MathUtils.damp(hoverRef.current, emphasis, 6, delta);

    // Hover lifts the monolith; dimmed siblings recede.
    const idleFloat = reduced ? 0 : Math.sin(time * 0.45 + index * 1.3) * 0.11;
    const targetY = idleFloat + hoverRef.current * 0.42;
    group.position.set(x, targetY, z + (isDimmed ? -1.6 : 0));

    const targetScale = isDimmed ? 0.9 : 1;
    group.scale.setScalar(MathUtils.damp(group.scale.x, targetScale, 4, delta));

    if (!reduced) {
      group.rotation.y = MathUtils.damp(
        group.rotation.y,
        Math.sin(time * 0.25 + index) * 0.06 + hoverRef.current * 0.14,
        3,
        delta,
      );
    }

    const material = materialRef.current;
    if (material) {
      material.uTime = time;
      material.uHover = hoverRef.current * (isDimmed ? 0.2 : 1);
      material.uOpacity = 0.24 + (isDimmed ? -0.1 : 0) + hoverRef.current * 0.1;

      if (hovered || isOpen) {
        sweepRef.current += delta * MONOLITH_HEIGHT * 0.85;
        if (sweepRef.current > MONOLITH_HEIGHT / 2) sweepRef.current = -MONOLITH_HEIGHT / 2;
      } else {
        sweepRef.current = -MONOLITH_HEIGHT / 2;
      }
      material.uSweep = sweepRef.current;
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <RoundedBox
        ref={slabRef}
        args={[MONOLITH_WIDTH, MONOLITH_HEIGHT, MONOLITH_DEPTH]}
        radius={0.07}
        smoothness={4}
        onPointerOver={onOver}
        onPointerOut={onOut}
        onClick={onClick}
      >
        <fresnelMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          uColor={body}
          uRimColor={accent}
          uOpacity={0.24}
          uRimPower={2.2}
          uRimStrength={1.25}
          uSweepWidth={0.45}
        />
      </RoundedBox>

      {/* Index number, high on the slab. */}
      <SceneText
        variant="display"
        position={[0, MONOLITH_HEIGHT / 2 - 0.5, MONOLITH_DEPTH / 2 + 0.01]}
        fontSize={0.34}
        color="#FFFFFF"
        fillOpacity={isDimmed ? 0.12 : 0.32}
      >
        {String(index + 1).padStart(2, '0')}
      </SceneText>

      {/* Title, wrapped to the slab width. */}
      <SceneText
        variant="display"
        position={[0, 0.1, MONOLITH_DEPTH / 2 + 0.01]}
        fontSize={0.185}
        maxWidth={MONOLITH_WIDTH * 0.82}
        textAlign="center"
        lineHeight={1.16}
        color="#FFFFFF"
        fillOpacity={isDimmed ? 0.25 : 1}
      >
        {project.title}
      </SceneText>

      <SceneText
        position={[0, -MONOLITH_HEIGHT / 2 + 0.55, MONOLITH_DEPTH / 2 + 0.01]}
        fontSize={0.093}
        color="#9CA3AF"
        letterSpacing={0.1}
        maxWidth={MONOLITH_WIDTH * 0.82}
        textAlign="center"
        fillOpacity={isDimmed ? 0.2 : 1}
      >
        {project.discipline.toUpperCase()}
      </SceneText>

      {/* Reflection pool beneath each monolith. */}
      <mesh position={[0, -MONOLITH_HEIGHT / 2 - 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.35, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.055} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * Projects environment — a floating gallery of glass monoliths. Clicking one
 * flies the camera in and opens the case study panel in the DOM overlay.
 */
export function ProjectsScene() {
  const groupRef = useRef<Group>(null);

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group || getUi().reducedMotion) return;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    // The gallery drifts gently against the camera parallax.
    group.rotation.y = MathUtils.damp(
      group.rotation.y,
      Math.sin(state.clock.elapsedTime * 0.06) * 0.05,
      2,
      delta,
    );
  });

  return (
    <group ref={groupRef}>
      {PROJECTS.map((project, index) => (
        <Monolith key={project.id} project={project} index={index} total={PROJECTS.length} />
      ))}
    </group>
  );
}

/** World-space centre of the projects environment, for camera bookkeeping. */
export const PROJECTS_ORIGIN = SECTION_BY_ID.projects.origin;
