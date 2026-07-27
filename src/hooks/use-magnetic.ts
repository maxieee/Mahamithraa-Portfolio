'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getUi } from '@/lib/store';

interface MagneticOptions {
  strength?: number;
  radius?: number;
}

/**
 * Magnetic hover — the element leans toward the cursor while it is inside
 * `radius`, then eases back. Disabled for coarse pointers and reduced motion.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.32,
  radius = 90,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (getUi().reducedMotion) return;

    const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);
      const reach = Math.max(rect.width, rect.height) / 2 + radius;

      if (distance > reach) {
        quickX(0);
        quickY(0);
        return;
      }
      const falloff = 1 - distance / reach;
      quickX(dx * strength * falloff);
      quickY(dy * strength * falloff);
    };

    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, radius]);

  return ref;
}
