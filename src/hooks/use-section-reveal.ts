'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-enter. Uses a single IntersectionObserver per element and
 * disconnects after the first intersection so scrolling back does not re-run
 * the animation (the brief asks for calm, not repetition).
 */
export function useSectionReveal<T extends HTMLElement>(threshold = 0.22) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
