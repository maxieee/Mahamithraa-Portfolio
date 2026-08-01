'use client';

import { motion } from 'framer-motion';
import { Award, Medal, Mic, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ACHIEVEMENTS } from '@/lib/content/career';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { POWER3_OUT } from '@/lib/motion';
import { useTilt } from '@/hooks/use-tilt';
import { SectionShell } from './section-shell';
import type { Achievement } from '@/types';

const ICONS: Record<Achievement['form'], LucideIcon> = {
  cup: Trophy,
  star: Mic,
  ring: Medal,
  obelisk: Award,
};

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const tiltRef = useTilt<HTMLDivElement>(4);
  const Icon = ICONS[achievement.form];

  return (
    <motion.div
      ref={tiltRef}
      className="glass group flex h-full flex-col gap-5 rounded-2xl p-7 transition-[border-color] duration-500 hover:border-accent/35"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.85, ease: POWER3_OUT, delay: index * 0.06 }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent transition-transform duration-500 ease-power3 group-hover:scale-110">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          {achievement.year}
        </span>
      </div>

      <div>
        <h3 className="text-subheading text-white">{achievement.title}</h3>
        <p className="mt-1 text-meta text-accent-soft">{achievement.context}</p>
      </div>

      <p className="text-pretty text-meta leading-relaxed text-muted">{achievement.detail}</p>
    </motion.div>
  );
}

export function AchievementsSection() {
  const meta = SECTION_BY_ID.achievements;

  return (
    <SectionShell
      id="achievements"
      index={meta.index}
      eyebrow={meta.eyebrow}
      width="full"
      title={
        <>
          Recognition, and what
          <br />
          it was for.
        </>
      }
      lede="Awards are a lagging indicator. These are the ones where the thing being recognised is something I would want to be judged on again."
    >
      <ul className="mt-4 grid max-w-3xl gap-5 sm:grid-cols-2">
        {ACHIEVEMENTS.map((achievement, index) => (
          <li key={achievement.id} className="h-full">
            <AchievementCard achievement={achievement} index={index} />
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
