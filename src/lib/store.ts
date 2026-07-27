'use client';

import { useSyncExternalStore } from 'react';
import type { SectionId } from '@/types';

/**
 * Two-tier state.
 *
 * `mutable` is read inside the R3F render loop every frame and never triggers a
 * React render — scroll progress and pointer position live here. Anything that
 * genuinely changes the DOM (active section, open project, hovered skill) goes
 * through the subscribable store below.
 */
export const mutable = {
  /** Normalised scroll progress across the whole journey, 0..1. */
  scroll: 0,
  /** Damped scroll used by the camera so it trails the raw input slightly. */
  scrollEased: 0,
  /** Pointer in NDC, -1..1 on both axes. */
  pointer: { x: 0, y: 0 },
  /** Damped pointer for parallax. */
  pointerEased: { x: 0, y: 0 },
  /** Set while a GSAP camera tween owns the camera (nav jump / project focus). */
  cameraLocked: false,
  /** 0 = free flight, 1 = fully focused on a project monolith. */
  focusBlend: 0,
};

export interface UiState {
  ready: boolean;
  loadProgress: number;
  activeSection: SectionId;
  activeIndex: number;
  openProject: string | null;
  activeSkill: string | null;
  hoveredSkill: string | null;
  openCertificate: string | null;
  reducedMotion: boolean;
  quality: 'high' | 'medium' | 'low';
  audioEnabled: boolean;
}

let state: UiState = {
  ready: false,
  loadProgress: 0,
  activeSection: 'landing',
  activeIndex: 0,
  openProject: null,
  activeSkill: null,
  hoveredSkill: null,
  openCertificate: null,
  reducedMotion: false,
  quality: 'high',
  audioEnabled: false,
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function setUi(patch: Partial<UiState>) {
  let changed = false;
  for (const key of Object.keys(patch) as (keyof UiState)[]) {
    if (patch[key] !== undefined && state[key] !== patch[key]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  state = { ...state, ...patch };
  emit();
}

export function getUi(): UiState {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Selector-based subscription. The selector result is compared with `Object.is`
 * so a component only re-renders when the slice it reads actually changes.
 */
export function useUi<T>(selector: (s: UiState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}
