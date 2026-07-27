'use client';

import { useCallback, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, MathUtils, Vector3, type Group, type Mesh } from 'three';
import { SKILLS, SKILL_EDGES } from '@/lib/content/skills';
import { getUi, setUi, useUi } from '@/lib/store';
import { SceneText } from '../primitives/scene-text';
import { useColor } from '../use-color';
import type { LinkMaterial } from '../shaders/link-material';
import type { FresnelMaterial } from '../shaders/fresnel-material';
import type { Skill } from '@/types';
import { MAX_FRAME_DELTA } from '@/lib/utils';

/** Cylinder geometry runs along +Y; links are aimed from this axis. */
const UP = new Vector3(0, 1, 0);

const CATEGORY_COLOR: Record<Skill['category'], string> = {
  domain: '#3B82F6',
  tooling: '#67E8F9',
  human: '#A5F3FC',
};

/**
 * Shared, mutable table of live node positions in scene-local space.
 * Nodes write their position each frame; the links read it. Using a plain
 * object (not state) keeps the whole galaxy at zero React renders per frame.
 */
const nodePositions = new Map<string, Vector3>();
for (const skill of SKILLS) nodePositions.set(skill.id, new Vector3());

function orbitPosition(skill: Skill, time: number, target: Vector3) {
  const { radius, inclination, phase, speed } = skill.orbit;
  if (radius === 0) {
    // The hub sits at the centre and only breathes.
    target.set(0, Math.sin(time * 0.4) * 0.12, 0);
    return target;
  }
  const angle = phase + time * speed;
  target.set(
    Math.cos(angle) * radius,
    Math.sin(angle * 0.8 + phase) * radius * 0.34 + Math.sin(inclination + time * 0.3) * 0.4,
    Math.sin(angle) * radius * Math.cos(inclination),
  );
  return target;
}

function SkillNode({ skill }: { skill: Skill }) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  const materialRef = useRef<InstanceType<typeof FresnelMaterial>>(null);
  const stateRef = useRef({ hover: 0, active: 0 });

  const hoveredSkill = useUi((s) => s.hoveredSkill);
  const activeSkill = useUi((s) => s.activeSkill);

  const isHovered = hoveredSkill === skill.id;
  const isActive = activeSkill === skill.id;

  const accent = useColor(CATEGORY_COLOR[skill.category]);
  const body = useColor('#050816');

  const size = 0.14 + (skill.level / 100) * 0.13;

  const onOver = useCallback(() => {
    setUi({ hoveredSkill: skill.id });
    document.body.style.cursor = 'pointer';
  }, [skill.id]);

  const onOut = useCallback(() => {
    if (getUi().hoveredSkill === skill.id) setUi({ hoveredSkill: null });
    document.body.style.cursor = '';
  }, [skill.id]);

  const onClick = useCallback(() => {
    setUi({ activeSkill: getUi().activeSkill === skill.id ? null : skill.id });
  }, [skill.id]);

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    if (!group) return;
    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);
    const time = state.clock.elapsedTime;
    const reduced = getUi().reducedMotion;

    const position = nodePositions.get(skill.id);
    if (position) {
      orbitPosition(skill, reduced ? skill.orbit.phase * 4 : time, position);
      group.position.copy(position);
    }

    stateRef.current.hover = MathUtils.damp(stateRef.current.hover, isHovered ? 1 : 0, 8, delta);
    stateRef.current.active = MathUtils.damp(stateRef.current.active, isActive ? 1 : 0, 6, delta);

    const emphasis = Math.max(stateRef.current.hover, stateRef.current.active);

    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + emphasis * 0.55);
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(1 + emphasis * 1.15 + Math.sin(time * 1.4) * 0.03);
      const material = haloRef.current.material as { opacity: number };
      material.opacity = 0.06 + emphasis * 0.22;
    }
    if (materialRef.current) {
      materialRef.current.uTime = time;
      materialRef.current.uHover = emphasis;
      materialRef.current.uRimStrength = 1.4 + emphasis * 1.8;
    }

    // The label always faces the camera and fades in with emphasis.
    const label = group.getObjectByName('label');
    if (label) {
      label.quaternion.copy(state.camera.quaternion);
      label.scale.setScalar(0.9 + emphasis * 0.25);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Generous invisible hit area — the visible node is small on purpose. */}
      <mesh
        onPointerOver={onOver}
        onPointerOut={onOut}
        onClick={onClick}
        visible={false}
      >
        <sphereGeometry args={[size * 3.2, 8, 8]} />
        <meshBasicMaterial />
      </mesh>

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[size, 2]} />
        <fresnelMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          uColor={body}
          uRimColor={accent}
          uOpacity={0.55}
          uRimPower={1.7}
          uRimStrength={1.4}
        />
      </mesh>

      <mesh ref={haloRef}>
        <sphereGeometry args={[size * 2.1, 16, 16]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.06}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <group name="label" position={[0, size * 2.6, 0]}>
        <SceneText fontSize={0.15} color="#FFFFFF" letterSpacing={-0.01}>
          {skill.name}
        </SceneText>
      </group>
    </group>
  );
}

/**
 * One constellation link. The tube is rebuilt from a unit cylinder each frame
 * by transform only — no geometry regeneration, so ten links cost nothing.
 */
function SkillLink({ from, to, seed }: { from: string; to: string; seed: number }) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<InstanceType<typeof LinkMaterial>>(null);
  const activeRef = useRef(0);

  const hoveredSkill = useUi((s) => s.hoveredSkill);
  const activeSkill = useUi((s) => s.activeSkill);
  const emphasised =
    hoveredSkill === from || hoveredSkill === to || activeSkill === from || activeSkill === to;

  const color = useColor('#3B82F6');
  const pulse = useColor('#A5F3FC');

  const scratch = useMemo(
    () => ({ start: new Vector3(), end: new Vector3(), dir: new Vector3(), mid: new Vector3() }),
    [],
  );

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    const start = nodePositions.get(from);
    const end = nodePositions.get(to);
    if (!mesh || !start || !end) return;

    const delta = Math.min(rawDelta, MAX_FRAME_DELTA);

    scratch.start.copy(start);
    scratch.end.copy(end);
    scratch.dir.subVectors(scratch.end, scratch.start);
    const length = scratch.dir.length();
    if (length < 0.0001) return;

    scratch.mid.addVectors(scratch.start, scratch.end).multiplyScalar(0.5);
    mesh.position.copy(scratch.mid);
    mesh.quaternion.setFromUnitVectors(UP, scratch.dir.normalize());
    mesh.scale.set(1, length, 1);

    activeRef.current = MathUtils.damp(activeRef.current, emphasised ? 1 : 0, 7, delta);

    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uActive = activeRef.current;
    }
  });

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <cylinderGeometry args={[0.008, 0.008, 1, 5, 1, true]} />
      <linkMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uColor={color}
        uPulseColor={pulse}
        uOpacity={0.3}
        uSeed={seed}
      />
    </mesh>
  );
}

/**
 * Skills environment — a slowly orbiting galaxy of capability nodes wired
 * together by animated links. Hover expands a node; clicking one pins it and
 * opens the detail card in the DOM overlay.
 */
export function SkillsScene() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || getUi().reducedMotion) return;
    group.rotation.y = state.clock.elapsedTime * 0.028;
  });

  // Scaled up so the nodes read at the section's viewing distance. Framing
  // (pushing the galaxy into the free right-hand side) is handled by the
  // section's camera keyframe, not here.
  return (
    <group ref={groupRef} scale={1.45}>
      {SKILL_EDGES.map(([from, to], index) => (
        <SkillLink key={`${from}-${to}`} from={from} to={to} seed={index * 3.13} />
      ))}
      {SKILLS.map((skill) => (
        <SkillNode key={skill.id} skill={skill} />
      ))}
    </group>
  );
}
