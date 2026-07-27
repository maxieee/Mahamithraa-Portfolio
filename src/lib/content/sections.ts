import type { SectionId, SectionMeta } from '@/types';
import type { Vector3Tuple } from 'three';

/**
 * How a section's camera keyframe is derived from its environment.
 *
 * Hand-typing camera positions meant every framing tweak was a guess. Instead
 * each environment declares how it wants to be looked at, and the keyframe is
 * computed:
 *
 * - `yaw` / `pitch` place the camera on a sphere around the environment. Yaw is
 *   measured from +Z, so 0 means "stand in front and look toward −Z".
 * - `distance` sets how much of the frame the environment fills.
 * - `shift` slides the look-at target sideways, which pushes the environment
 *   off-centre. Every section but the landing puts its copy panel on the left,
 *   so the environment is nudged into the free right-hand side of the frame.
 * - `lift` raises the camera above the environment's own height.
 * - `turn` rotates the environment away from face-on. Most scenes want to be
 *   met square, but a scene whose subject runs along an axis — the leadership
 *   bridge — collapses into a single point when viewed head-on and needs an
 *   oblique angle to read.
 */
interface View {
  yaw: number;
  pitch: number;
  distance: number;
  shift: number;
  lift: number;
  turn?: number;
}

interface SectionSpec {
  id: SectionId;
  label: string;
  eyebrow: string;
  origin: Vector3Tuple;
  view: View;
}

const DEG = Math.PI / 180;

/**
 * Each yaw points back toward the previous environment, so the camera always
 * arrives facing the way it travelled — that is what makes the transitions read
 * as one continuous flight rather than a series of cuts.
 */
const SPECS: SectionSpec[] = [
  {
    id: 'landing',
    label: 'Index',
    eyebrow: 'Entry',
    origin: [0, 0, 0],
    // Dead-on and centred: the headline is the subject here, not a side panel.
    view: { yaw: 0, pitch: 4 * DEG, distance: 17.0, shift: 0.0, lift: 1.1 },
  },
  {
    id: 'about',
    label: 'About',
    eyebrow: 'The operator',
    origin: [26, -3, -20],
    view: { yaw: -52 * DEG, pitch: 12 * DEG, distance: 9.5, shift: 2.6, lift: 0.6 },
  },
  {
    id: 'skills',
    label: 'Skills',
    eyebrow: 'Capability graph',
    origin: [54, 5, -48],
    view: { yaw: -45 * DEG, pitch: 6 * DEG, distance: 23.0, shift: 6.2, lift: 0.4 },
  },
  {
    id: 'projects',
    label: 'Work',
    eyebrow: 'Selected case studies',
    origin: [30, 1, -82],
    view: { yaw: 35 * DEG, pitch: 5 * DEG, distance: 17.0, shift: 4.6, lift: 0.5 },
  },
  {
    id: 'leadership',
    label: 'Leadership',
    eyebrow: 'The long walk',
    origin: [-6, -5, -104],
    view: { yaw: 58 * DEG, pitch: 11 * DEG, distance: 18.0, shift: 4.4, lift: 2.6, turn: -58 * DEG },
  },
  {
    id: 'experience',
    label: 'Experience',
    eyebrow: 'Where I have worked',
    origin: [-42, 3, -86],
    view: { yaw: 117 * DEG, pitch: 4 * DEG, distance: 13.0, shift: 3.5, lift: 0.2 },
  },
  {
    id: 'certifications',
    label: 'Certifications',
    eyebrow: 'Verified craft',
    origin: [-62, 7, -54],
    view: { yaw: 148 * DEG, pitch: 7 * DEG, distance: 16.0, shift: 4.3, lift: 0.7 },
  },
  {
    id: 'achievements',
    label: 'Achievements',
    eyebrow: 'Trophy room',
    origin: [-58, 2, -24],
    view: { yaw: 188 * DEG, pitch: 10 * DEG, distance: 13.0, shift: 3.5, lift: 1.2 },
  },
  {
    id: 'contact',
    label: 'Contact',
    eyebrow: 'Say hello',
    origin: [-30, -4, -2],
    view: { yaw: 232 * DEG, pitch: 15 * DEG, distance: 17.0, shift: 3.0, lift: 3.4 },
  },
];

function deriveKeyframes(origin: Vector3Tuple, view: View): {
  camera: Vector3Tuple;
  target: Vector3Tuple;
} {
  const { yaw, pitch, distance, shift, lift } = view;
  const [ox, oy, oz] = origin;

  // Camera offset from the environment, on a sphere.
  const horizontal = Math.cos(pitch) * distance;
  const cx = ox + Math.sin(yaw) * horizontal;
  const cy = oy + Math.sin(pitch) * distance + lift;
  const cz = oz + Math.cos(yaw) * horizontal;

  // The camera's right vector is the horizontal view direction rotated 90°.
  // Sliding the target along −right pushes the environment to frame right.
  const vx = ox - cx;
  const vz = oz - cz;
  const length = Math.hypot(vx, vz) || 1;
  const rightX = -vz / length;
  const rightZ = vx / length;

  return {
    camera: [cx, cy, cz],
    target: [ox - rightX * shift, oy, oz - rightZ * shift],
  };
}

export const SECTIONS: SectionMeta[] = SPECS.map((spec, index) => {
  const { camera, target } = deriveKeyframes(spec.origin, spec.view);
  return {
    id: spec.id,
    index,
    label: spec.label,
    eyebrow: spec.eyebrow,
    origin: spec.origin,
    camera,
    target,
    facing: spec.view.yaw + (spec.view.turn ?? 0),
  };
});

export const SECTION_IDS = SECTIONS.map((s) => s.id);

export const SECTION_BY_ID = Object.fromEntries(
  SECTIONS.map((section) => [section.id, section]),
) as Record<SectionId, SectionMeta>;

/** Normalised scroll progress (0..1) at which a section is centred. */
export function sectionProgress(index: number): number {
  return index / (SECTIONS.length - 1);
}
