'use client';

import { useEffect, useState } from 'react';
import { setUi } from '@/lib/store';

export interface DeviceProfile {
  quality: 'high' | 'medium' | 'low';
  dpr: [number, number];
  particleCount: number;
  /** Post-processing is expensive; disabled outright on low-end devices. */
  postProcessing: boolean;
  shadows: boolean;
  coarsePointer: boolean;
}

const PROFILES: Record<DeviceProfile['quality'], Omit<DeviceProfile, 'coarsePointer'>> = {
  high: { quality: 'high', dpr: [1, 2], particleCount: 2600, postProcessing: true, shadows: true },
  medium: { quality: 'medium', dpr: [1, 1.5], particleCount: 1400, postProcessing: true, shadows: false },
  low: { quality: 'low', dpr: [1, 1], particleCount: 700, postProcessing: false, shadows: false },
};

function detect(): DeviceProfile {
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const narrow = window.innerWidth < 768;

  let quality: DeviceProfile['quality'] = 'high';
  if (narrow || cores <= 4 || memory <= 4) quality = 'medium';
  if (cores <= 2 || memory <= 2) quality = 'low';

  return { ...PROFILES[quality], coarsePointer };
}

/**
 * Picks a rendering budget once on mount. Deliberately not reactive to resize —
 * swapping DPR and particle buffers mid-session costs more than it saves.
 */
export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>({
    ...PROFILES.medium,
    coarsePointer: false,
  });

  useEffect(() => {
    const detected = detect();
    setProfile(detected);
    setUi({ quality: detected.quality });
  }, []);

  return profile;
}
