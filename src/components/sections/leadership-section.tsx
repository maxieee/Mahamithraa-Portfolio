'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MILESTONES } from '@/lib/content/career';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { POWER3_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { SectionShell } from './section-shell';

export function LeadershipSection() {
  const meta = SECTION_BY_ID.leadership;

  return (
    <SectionShell
      id="leadership"
      index={meta.index}
      eyebrow={meta.eyebrow}
      width="wide"
      title={
        <>
          Responsibility, taken
          <br />
          one step at a time.
        </>
      }
      lede="Each role was earned through the trust of people who had seen me work. The scope changed, but the responsibility remained the same: set direction, distribute ownership, and maintain a high standard."
    >
      <ol className="relative mt-2 flex flex-col gap-7">
        {/* Spine mirroring the bridge in the 3D scene. */}
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent/60 via-accent/25 to-transparent"
        />

        {MILESTONES.map((milestone, index) => (
          <motion.li
            key={milestone.id}
            className="relative pl-10"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: POWER3_OUT, delay: index * 0.05 }}
          >
            <span
              aria-hidden="true"
              className={cn(
                'absolute left-0 top-1.5 block size-[15px] rotate-45 border',
                milestone.future
                  ? 'border-muted/50 bg-transparent'
                  : 'border-accent bg-accent/25 shadow-[0_0_16px_rgba(59,130,246,0.55)]',
              )}
            />

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="text-subheading text-white">{milestone.title}</h3>
              <p className="text-meta text-accent-soft">{milestone.organisation}</p>
              <p className="ml-auto font-mono text-xs uppercase tracking-widest text-muted">
                {milestone.period}
              </p>
            </div>

            <p className="mt-3 max-w-2xl text-pretty text-meta leading-relaxed text-muted">
              {milestone.description}
            </p>
            <a
              href={milestone.proofUrl ?? '#'}
              target={milestone.proofUrl && milestone.proofUrl !== '#' ? '_blank' : undefined}
              rel={milestone.proofUrl && milestone.proofUrl !== '#' ? 'noreferrer noopener' : undefined}
              title={milestone.proofUrl === '#' ? 'Proof link to be added' : undefined}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-white"
            >
              View Proof
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          </motion.li>
        ))}
      </ol>
    </SectionShell>
  );
}
