import type { Vector3Tuple } from 'three';

export type SectionId =
  | 'landing'
  | 'about'
  | 'skills'
  | 'projects'
  | 'leadership'
  | 'experience'
  | 'certifications'
  | 'achievements'
  | 'contact';

export interface SectionMeta {
  id: SectionId;
  index: number;
  label: string;
  eyebrow: string;
  /** Where this environment lives in world space. */
  origin: Vector3Tuple;
  /** Camera resting position for the section. */
  camera: Vector3Tuple;
  /** Camera look-at target for the section. */
  target: Vector3Tuple;
  /**
   * Y rotation applied to the environment so its front faces the camera.
   * Scenes are authored facing +Z; the camera sits wherever the flight path
   * needs it, so the environment turns to meet it rather than the other way
   * around.
   */
  facing: number;
}

export type SkillCategory = 'domain' | 'tooling' | 'human';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  summary: string;
  /** Ids of related skills — drawn as animated links in the galaxy. */
  links: string[];
  /** Orbit descriptor: radius, inclination (rad), phase offset (rad), speed. */
  orbit: { radius: number; inclination: number; phase: number; speed: number };
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  discipline: string;
  challenge: string;
  approach: string;
  tools: string[];
  outcome: string;
  metrics: { label: string; value: string }[];
  image: string;
  accent: string;
}

export interface Milestone {
  id: string;
  title: string;
  organisation: string;
  period: string;
  description: string;
  /** Future milestones render as an unlit, wireframe crystal. */
  future?: boolean;
  proofUrl?: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  achievements: string[];
  certificateUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  focus: string;
  credentialSummary: string;
  verificationUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  context: string;
  year: string;
  detail: string;
  /** Drives the trophy geometry variant in the 3D trophy room. */
  form: 'cup' | 'star' | 'ring' | 'obelisk';
  proofUrl?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  handle: string;
}
