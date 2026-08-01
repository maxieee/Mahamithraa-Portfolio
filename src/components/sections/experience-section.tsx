'use client';

import { motion } from 'framer-motion';
import { EXPERIENCE } from '@/lib/content/career';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { POWER3_OUT } from '@/lib/motion';
import { SectionShell } from './section-shell';

export function ExperienceSection() {
  const meta = SECTION_BY_ID.experience;

  return (
    <SectionShell
      id="experience"
      index={meta.index}
      eyebrow={meta.eyebrow}
      width="full"
      title={
        <>
          Where the theory
          <br />
          met the floor.
        </>
      }
      lede="A leadership mandate, a finance function and a live production line. Different vocabularies, same underlying question: where does the work actually get stuck?"
    >
      {/*
        A single narrow column rather than three side-by-side cards: three
        columns forced this much copy into ribbons of two-word lines and pushed
        the section well past one viewport, which broke the scroll-to-camera
        pacing. Stacked rows also leave the glass timeline behind them visible.
      */}
      <ul className="mt-2 flex max-w-2xl flex-col gap-3">
        {EXPERIENCE.map((entry, index) => (
          <motion.li
            key={entry.id}
            className="glass flex flex-col rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, ease: POWER3_OUT, delay: index * 0.07 }}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold leading-snug text-white">{entry.role}</h3>
              <p className="text-meta text-accent-soft">{entry.company}</p>
              <p className="ml-auto whitespace-nowrap font-mono text-xs uppercase tracking-widest text-muted">
                {entry.period}
              </p>
            </div>

            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">{entry.summary}</p>

            <ul className="mt-3 flex flex-col gap-1.5 border-t border-hairline pt-3">
              {entry.achievements.map((achievement) => (
                <li key={achievement} className="flex gap-2.5 text-sm leading-relaxed text-white/80">
                  <span
                    aria-hidden="true"
                    className="mt-2 block size-1 shrink-0 rounded-full bg-accent"
                  />
                  {achievement}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ul>
    </SectionShell>
  );
}
