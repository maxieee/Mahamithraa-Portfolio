'use client';

import { useEffect, useState } from 'react';
import { setUi } from '@/lib/store';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the OS-level reduced-motion preference and mirrors it into the shared
 * store so the R3F loop (which never re-renders) can read it too.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const apply = (matches: boolean) => {
      setReduced(matches);
      setUi({ reducedMotion: matches });
    };
    apply(media.matches);
    const onChange = (event: MediaQueryListEvent) => apply(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
