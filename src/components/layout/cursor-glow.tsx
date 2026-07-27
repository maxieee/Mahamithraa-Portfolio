'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getUi } from '@/lib/store';

/**
 * Two-layer cursor: a small solid dot that tracks exactly, and a soft glow that
 * trails behind it. The glow expands over interactive elements.
 *
 * Rendered only for fine pointers and when motion is allowed — the native
 * cursor is never hidden, so nothing is lost if this is skipped.
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setEnabled(fine && !getUi().reducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const glowX = gsap.quickTo(glow, 'x', { duration: 0.65, ease: 'power3.out' });
    const glowY = gsap.quickTo(glow, 'y', { duration: 0.65, ease: 'power3.out' });

    const onMove = (event: PointerEvent) => {
      dotX(event.clientX);
      dotY(event.clientY);
      glowX(event.clientX);
      glowY(event.clientY);
    };

    // Delegated hover detection — one listener regardless of how many
    // interactive elements exist.
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor]';
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest?.(INTERACTIVE);
      gsap.to(glow, {
        scale: interactive ? 2.1 : 1,
        opacity: interactive ? 0.5 : 0.28,
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.to(dot, { scale: interactive ? 0.35 : 1, duration: 0.4, ease: 'power3.out' });
    };

    const onLeave = () => {
      gsap.to([dot, glow], { opacity: 0, duration: 0.3 });
    };
    const onEnter = () => {
      gsap.to(dot, { opacity: 1, duration: 0.3 });
      gsap.to(glow, { opacity: 0.28, duration: 0.3 });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      gsap.killTweensOf([dot, glow]);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
      <div
        ref={glowRef}
        className="absolute -left-14 -top-14 size-28 rounded-full opacity-0 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(103,232,249,0.18) 45%, transparent 70%)',
        }}
      />
      <div
        ref={dotRef}
        className="absolute -left-1 -top-1 size-2 rounded-full bg-white opacity-0 mix-blend-difference"
      />
    </div>
  );
}
