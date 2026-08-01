'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { PROFILE } from '@/lib/content/profile';
import { useUi } from '@/lib/store';
import { POWER4_OUT } from '@/lib/motion';
import { useScrollApi } from '@/components/providers/smooth-scroll-provider';

/**
 * Loading screen.
 *
 * Scrolling is locked until the world is ready, so nobody starts the camera
 * journey mid-load. The counter is eased rather than mapped straight to the
 * loader value — real progress arrives in jumps and looks broken raw.
 */
export function Preloader() {
  const ready = useUi((s) => s.ready);
  const loadProgress = useUi((s) => s.loadProgress);
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(0);
  const scroll = useScrollApi();
  const shownRef = useRef({ value: 0 });

  useEffect(() => {
    scroll.stop();
    window.scrollTo(0, 0);
    return () => scroll.start();
  }, [scroll]);

  useEffect(() => {
    const tween = gsap.to(shownRef.current, {
      value: ready ? 100 : Math.max(loadProgress, 8),
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: () => setDisplay(Math.round(shownRef.current.value)),
    });
    return () => {
      tween.kill();
    };
  }, [loadProgress, ready]);

  useEffect(() => {
    if (!ready) return;
    // Hold briefly at 100 so the reveal reads as intentional, not a flicker.
    const timeout = window.setTimeout(() => {
      setVisible(false);
      scroll.start();
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [ready, scroll]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-void px-6 py-10 sm:px-10"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1, ease: POWER4_OUT } }}
          role="status"
          aria-live="polite"
          aria-label={`Loading, ${display} percent`}
        >
          <div className="flex items-start justify-between">
            <motion.p
              className="text-eyebrow uppercase text-muted"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: POWER4_OUT, delay: 0.1 }}
            >
              {PROFILE.name}
            </motion.p>
            <motion.p
              className="text-eyebrow uppercase text-muted"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: POWER4_OUT, delay: 0.18 }}
            >
              Portfolio &mdash; 2026
            </motion.p>
          </div>

          <div className="flex flex-col gap-8">
            <motion.h1
              className="max-w-3xl text-display text-white"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: POWER4_OUT, delay: 0.22 }}
            >
              Think.
              <br />
              Solve.
              <br />
              Lead.
            </motion.h1>

            <div className="flex items-end justify-between gap-8">
              <motion.p
                className="max-w-md text-meta text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: POWER4_OUT, delay: 0.5 }}
              >
                Building the world &mdash; nine environments, one continuous flight.
              </motion.p>
              <p className="font-mono text-5xl font-light tabular-nums text-white sm:text-7xl">
                {String(display).padStart(3, '0')}
              </p>
            </div>

            {/* Progress rule. */}
            <div className="h-px w-full overflow-hidden bg-hairline">
              <motion.div
                className="h-full bg-accent"
                style={{ transformOrigin: 'left' }}
                animate={{ scaleX: display / 100 }}
                transition={{ duration: 0.6, ease: POWER4_OUT }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
