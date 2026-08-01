'use client';

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mutable, setUi } from '@/lib/store';
import { SECTIONS } from '@/lib/content/sections';
import { clamp } from '@/lib/utils';
import type { SectionId } from '@/types';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface ScrollApi {
  scrollToSection: (id: SectionId) => void;
  scrollToIndex: (index: number) => void;
  stop: () => void;
  start: () => void;
}

const ScrollContext = createContext<ScrollApi | null>(null);

export function useScrollApi(): ScrollApi {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScrollApi must be used within <SmoothScrollProvider>');
  return ctx;
}

const LAST = SECTIONS.length - 1;

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  /** Document Y offset of each section element, measured from the live DOM. */
  const anchorsRef = useRef<number[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      // Power4-ish easing: long tail, no overshoot.
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: !reducedMotion,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    /**
     * Progress must be anchored to where the sections actually are, not to
     * `scrollY / documentHeight`. The footer and any section taller than the
     * viewport would otherwise skew the mapping and drift the camera out of
     * step with the copy — the camera would arrive at the trophy room while
     * the contact form was on screen.
     */
    const measure = () => {
      anchorsRef.current = SECTIONS.map((section) => {
        const element = document.getElementById(section.id);
        if (!element) return 0;
        return element.getBoundingClientRect().top + window.scrollY;
      });
    };

    /** Piecewise-linear position along the section list, in units of sections. */
    const positionAt = (y: number): number => {
      const anchors = anchorsRef.current;
      if (anchors.length < 2) return 0;

      let index = 0;
      while (index < anchors.length - 2 && y >= (anchors[index + 1] ?? 0)) index += 1;

      const start = anchors[index] ?? 0;
      const end = anchors[index + 1] ?? start + 1;
      const span = Math.max(end - start, 1);
      return clamp(index + (y - start) / span, 0, LAST);
    };

    const onScroll = () => {
      const position = positionAt(lenis.scroll);
      mutable.scroll = position / LAST;

      const section = SECTIONS[clamp(Math.round(position), 0, LAST)];
      if (section) {
        setUi({ activeSection: section.id, activeIndex: section.index });
      }
    };

    lenis.on('scroll', onScroll);
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so scroll, camera and DOM tweens all
    // advance on the same clock — this is what stops micro-jitter.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (typeof value === 'number') lenis.scrollTo(value, { immediate: true });
        return lenis.scroll;
      },
    });

    // Re-measure whenever layout can have changed: resize, font swap, or a
    // section growing because a detail panel opened.
    const remeasure = () => {
      measure();
      onScroll();
    };

    measure();
    onScroll();

    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    window.addEventListener('resize', remeasure);
    document.fonts?.ready.then(remeasure).catch(() => undefined);

    return () => {
      lenis.off('scroll', onScroll);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(tick);
      observer.disconnect();
      window.removeEventListener('resize', remeasure);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);

  const api = useMemo<ScrollApi>(() => {
    const scrollToIndex = (index: number) => {
      const lenis = lenisRef.current;
      if (!lenis) return;
      const target = anchorsRef.current[clamp(index, 0, LAST)];
      if (target === undefined) return;
      lenis.scrollTo(target, {
        duration: reducedMotion ? 0.001 : 2.1,
        easing: (t: number) => 1 - (1 - t) ** 4,
      });
    };

    return {
      scrollToIndex,
      scrollToSection(id) {
        const section = SECTIONS.find((s) => s.id === id);
        if (section) scrollToIndex(section.index);
      },
      stop() {
        lenisRef.current?.stop();
      },
      start() {
        lenisRef.current?.start();
      },
    };
  }, [reducedMotion]);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
