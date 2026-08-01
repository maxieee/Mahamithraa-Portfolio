'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeRise, reduceVariants, stagger } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { SectionId } from '@/types';
import type { ReactNode } from 'react';

interface SectionShellProps {
  id: SectionId;
  index: number;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Which side of the viewport the copy column sits on. */
  align?: 'left' | 'right' | 'center';
  /** Sections that are mostly 3D keep their panel narrow and out of the way. */
  width?: 'narrow' | 'wide' | 'full';
}

/**
 * Every section is a full-viewport scroll stop whose DOM panel floats over the
 * 3D world. The panel carries the real, indexable, screen-reader-accessible
 * content — the canvas behind it is decorative.
 */
export function SectionShell({
  id,
  index,
  eyebrow,
  title,
  lede,
  children,
  className,
  align = 'left',
  width = 'narrow',
}: SectionShellProps) {
  const reduced = useReducedMotion();
  const variants = reduceVariants(fadeRise, reduced);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      // The section itself never intercepts the pointer — only its content
      // panel does — so hovering and clicking 3D objects behind it still works.
      // Top padding clears the fixed nav even when a section's content is tall
      // enough to fill the viewport on its own.
      className={cn(
        'pointer-events-none relative z-10 flex min-h-[100svh] w-full items-center px-6 pb-24 pt-32 lg:px-10',
        className,
      )}
    >
      {/*
        Legibility scrim. Text sits over a live 3D scene, so a darkening layer
        behind the copy column is what keeps body text above the WCAG AA
        contrast ratio no matter what the camera is passing at the time.

        Below `lg` the copy spans the full width, so the environment can no
        longer be framed beside it — the scrim goes near-solid there and only
        becomes directional once there is a free column to reveal.
      */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-b from-void/95 via-void/85 to-void/70',
          align === 'right'
            ? 'lg:bg-gradient-to-l lg:from-void lg:via-void/55 lg:to-transparent'
            : align === 'center'
              ? 'lg:bg-gradient-to-t lg:from-void lg:via-void/45 lg:to-transparent'
              : 'lg:bg-gradient-to-r lg:from-void lg:via-void/55 lg:to-transparent',
        )}
      />

      <div
        className={cn(
          'relative mx-auto flex w-full max-w-[1440px]',
          align === 'right' && 'justify-end',
          align === 'center' && 'justify-center',
        )}
      >
        <motion.div
          className={cn(
            'pointer-events-auto flex flex-col gap-7',
            width === 'narrow' && 'max-w-xl',
            width === 'wide' && 'max-w-3xl',
            width === 'full' && 'w-full',
            align === 'center' && 'items-center text-center',
          )}
          variants={stagger(0.09, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.28 }}
        >
          <motion.p variants={variants} className="eyebrow">
            <span className="sr-only">Section {index + 1}: </span>
            {eyebrow}
          </motion.p>

          <motion.h2
            id={`${id}-title`}
            variants={variants}
            className="text-balance text-heading text-white"
          >
            {title}
          </motion.h2>

          {lede ? (
            <motion.div
              variants={variants}
              className="max-w-2xl text-pretty text-body text-muted"
            >
              {lede}
            </motion.div>
          ) : null}

          {children ? <motion.div variants={variants}>{children}</motion.div> : null}
        </motion.div>
      </div>
    </section>
  );
}
