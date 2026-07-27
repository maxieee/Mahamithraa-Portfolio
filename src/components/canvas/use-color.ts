'use client';

import { useMemo } from 'react';
import { Color } from 'three';

/**
 * Memoised THREE.Color for shader uniforms.
 *
 * Custom `shaderMaterial` uniforms expose a Color instance, so passing an
 * explicit Color (rather than a hex string) makes R3F take the `copy` path and
 * avoids allocating a new object on every render.
 */
export function useColor(hex: string): Color {
  return useMemo(() => new Color(hex), [hex]);
}

export function useColors<const T extends readonly string[]>(hexes: T): Color[] {
  const key = hexes.join('|');
  // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the joined value
  return useMemo(() => hexes.map((hex) => new Color(hex)), [key]);
}
