import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge has to be told about the editorial type scale.
 *
 * Out of the box it classifies `text-heading` as a *colour* utility, so
 * `cn('text-heading text-white')` silently dropped the size and left headings
 * rendering at the inherited 16px. Registering the custom sizes puts them in
 * the font-size group, where they no longer conflict with `text-<colour>`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display',
            'display-sm',
            'heading',
            'subheading',
            'body',
            'meta',
            'eyebrow',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Upper bound on the per-frame delta used by every animated scene.
 *
 * Capping delta stops a backgrounded tab or a long GC pause from teleporting
 * the camera when the loop resumes. The bound has to sit *below* the slowest
 * frame rate we still want to animate correctly, though: clamping to 1/30 made
 * everything run in slow motion on hardware rendering under 30fps, because each
 * frame then advanced less real time than had actually elapsed. 1/15 keeps the
 * jump protection while degrading gracefully.
 */
export const MAX_FRAME_DELTA = 1 / 15;

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Frame-rate independent damping. `lambda` is roughly "smoothness". */
export function damp(current: number, target: number, lambda: number, delta: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * delta));
}

export function inverseLerp(a: number, b: number, value: number): number {
  if (a === b) return 0;
  return clamp((value - a) / (b - a));
}

/** Smoothstep easing — no overshoot, matches the "nothing bounces" brief. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = inverseLerp(edge0, edge1, x);
  return t * t * (3 - 2 * t);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return lerp(outMin, outMax, inverseLerp(inMin, inMax, value));
}

export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}
