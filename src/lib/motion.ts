import type { Transition, Variants } from 'framer-motion';

/** Power3.out expressed as a cubic bezier — shared by GSAP and Framer Motion. */
export const POWER3_OUT: [number, number, number, number] = [0.215, 0.61, 0.355, 1];
export const POWER4_OUT: [number, number, number, number] = [0.165, 0.84, 0.44, 1];

export const EASE = {
  power3: POWER3_OUT,
  power4: POWER4_OUT,
} as const;

export const transition = {
  base: { duration: 0.9, ease: POWER3_OUT } satisfies Transition,
  slow: { duration: 1.4, ease: POWER4_OUT } satisfies Transition,
  fast: { duration: 0.45, ease: POWER3_OUT } satisfies Transition,
} as const;

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: transition.base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition.base },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Framer Motion variants collapse to a plain fade when motion is reduced. */
export function reduceVariants(variants: Variants, reduced: boolean): Variants {
  if (!reduced) return variants;
  return {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
  };
}
