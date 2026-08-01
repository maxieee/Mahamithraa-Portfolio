'use client';

import { useEffect } from 'react';
import { mutable } from '@/lib/store';

/**
 * Single global pointer listener. Writes straight into the mutable store — no
 * React state, so moving the mouse costs zero renders. Everything that needs
 * the pointer (cursor, parallax, particles) reads it from there.
 */
export function PointerProvider() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mutable.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      mutable.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const onLeave = () => {
      mutable.pointer.x = 0;
      mutable.pointer.y = 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return null;
}
