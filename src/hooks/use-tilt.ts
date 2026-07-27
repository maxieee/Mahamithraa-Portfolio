'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getUi } from '@/lib/store';

/**
 * Subtle 3D tilt on hover. Rotation is capped low on purpose — the brief calls
 * for calm depth, not a novelty card flip.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 5) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (getUi().reducedMotion) return;

    gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });

    const quickRx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const quickRy = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      quickRy(px * maxDeg * 2);
      quickRx(-py * maxDeg * 2);
    };

    const onLeave = () => {
      quickRx(0);
      quickRy(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [maxDeg]);

  return ref;
}
