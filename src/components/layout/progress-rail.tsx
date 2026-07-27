'use client';

import { useEffect, useRef } from 'react';
import { SECTIONS } from '@/lib/content/sections';
import { mutable, useUi } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useScrollApi } from '@/components/providers/smooth-scroll-provider';

/**
 * Right-hand journey rail: where you are in the flight, and a shortcut to any
 * environment. The fill is driven by an rAF loop reading the mutable scroll
 * value, so it tracks the camera without re-rendering React on every frame.
 */
export function ProgressRail() {
  const activeIndex = useUi((s) => s.activeIndex);
  const ready = useUi((s) => s.ready);
  const fillRef = useRef<HTMLSpanElement>(null);
  const scroll = useScrollApi();

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${mutable.scrollEased.toFixed(4)})`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <aside
      className={cn(
        'fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 transition-opacity duration-700 xl:flex',
        ready ? 'opacity-100' : 'opacity-0',
      )}
      aria-hidden="true"
    >
      <div className="relative h-40 w-px bg-hairline">
        <span
          ref={fillRef}
          className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>

      <ul className="flex flex-col items-center gap-3">
        {SECTIONS.map((section) => {
          const active = section.index === activeIndex;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scroll.scrollToSection(section.id)}
                className="group flex items-center gap-3"
                tabIndex={-1}
              >
                <span
                  className={cn(
                    'block rounded-full transition-all duration-500 ease-power3',
                    active
                      ? 'size-2 bg-accent shadow-[0_0_12px_rgba(59,130,246,0.9)]'
                      : 'size-1.5 bg-white/25 group-hover:bg-white/60',
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <p className="font-mono text-[11px] tabular-nums text-muted">
        {String(activeIndex + 1).padStart(2, '0')}
        <span className="text-white/25"> / {String(SECTIONS.length).padStart(2, '0')}</span>
      </p>
    </aside>
  );
}
