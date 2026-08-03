'use client';

import { useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SKILLS, SKILL_BY_ID, SKILL_CATEGORY_LABEL } from '@/lib/content/skills';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { getUi, setUi, useUi } from '@/lib/store';
import { cn } from '@/lib/utils';
import { POWER3_OUT } from '@/lib/motion';
import { SectionShell } from './section-shell';
import { Badge } from '@/components/ui/badge';

const SKILL_ANALYTICS = (['domain', 'tooling', 'human'] as const).map((category) => {
  const skills = SKILLS.filter((skill) => skill.category === category);
  return {
    category,
    label: SKILL_CATEGORY_LABEL[category],
    average: Math.round(skills.reduce((total, skill) => total + skill.level, 0) / skills.length),
    levels: skills.map((skill) => skill.level),
  };
});

/**
 * Skills panel.
 *
 * Every node in the 3D galaxy has a matching button here, so the whole
 * interaction — selecting a skill, reading its detail — is fully available by
 * keyboard and to screen readers. Hovering a button also lights the
 * corresponding 3D node, keeping the two representations in sync.
 */
export function SkillsSection() {
  const meta = SECTION_BY_ID.skills;
  const activeSkill = useUi((s) => s.activeSkill);
  const detail = activeSkill ? SKILL_BY_ID[activeSkill] : undefined;

  const select = useCallback((id: string) => {
    setUi({ activeSkill: getUi().activeSkill === id ? null : id });
  }, []);

  return (
    <SectionShell
      id="skills"
      index={meta.index}
      eyebrow={meta.eyebrow}
      width="wide"
      title={
        <>
          A connected toolkit,
          <br />
          not a list of logos.
        </>
      }
      lede="Domain judgement, the tooling to evidence it, and the human skills to move it through an organisation. Select any capability to see how I actually use it."
      >
        <div className="flex flex-col gap-8">
          <div className="grid gap-3 sm:grid-cols-3" aria-label="Skills overview">
            {SKILL_ANALYTICS.map((item, index) => (
              <motion.article
                key={item.category}
                className="glass rounded-2xl p-5"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, ease: POWER3_OUT, delay: index * 0.06 }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs uppercase tracking-widest text-muted">{item.label}</p>
                  <p className="font-mono text-lg text-white">{item.average}%</p>
                </div>
                <div className="mt-4 flex h-9 items-end gap-1" aria-hidden="true">
                  {item.levels.map((level, levelIndex) => (
                    <motion.span
                      key={`${item.category}-${levelIndex}`}
                      className="flex-1 rounded-t bg-gradient-to-t from-accent/35 to-glow/80"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: level / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: POWER3_OUT, delay: 0.12 + levelIndex * 0.07 }}
                      style={{ height: '100%', transformOrigin: 'bottom' }}
                    />
                  ))}
                </div>
                <div className="mt-3 h-px overflow-hidden bg-hairline">
                  <motion.span
                    className="block h-full bg-accent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: item.average / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: POWER3_OUT, delay: 0.15 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              </motion.article>
            ))}
          </div>

          <ul className="flex flex-wrap gap-2" aria-label="Skills">
          {SKILLS.map((skill) => {
            const active = activeSkill === skill.id;
            return (
              <li key={skill.id}>
                <button
                  type="button"
                  onClick={() => select(skill.id)}
                  onMouseEnter={() => setUi({ hoveredSkill: skill.id })}
                  onMouseLeave={() =>
                    setUi({ hoveredSkill: getUi().hoveredSkill === skill.id ? null : getUi().hoveredSkill })
                  }
                  onFocus={() => setUi({ hoveredSkill: skill.id })}
                  onBlur={() => setUi({ hoveredSkill: null })}
                  aria-pressed={active}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-all duration-300 ease-power3',
                    active
                      ? 'border-accent/50 bg-accent/15 text-white shadow-accent-glow'
                      : 'border-hairline bg-white/[0.03] text-muted hover:border-accent/30 hover:text-white',
                  )}
                >
                  {skill.name}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Detail card — the DOM twin of the 3D information panel. */}
        <div aria-live="polite" className="min-h-[13rem]">
          <AnimatePresence mode="wait">
            {detail ? (
              <motion.article
                key={detail.id}
                className="glass rounded-2xl p-7"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: POWER3_OUT }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-subheading text-white">{detail.name}</h3>
                  <Badge variant="glow">{SKILL_CATEGORY_LABEL[detail.category]}</Badge>
                </div>

                <p className="mt-4 max-w-2xl text-pretty text-meta leading-relaxed text-muted">
                  {detail.summary}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <div
                    className="h-px flex-1 overflow-hidden bg-hairline"
                    role="meter"
                    aria-valuenow={detail.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${detail.name} proficiency`}
                  >
                    <motion.span
                      className="block h-full bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: detail.level / 100 }}
                      style={{ transformOrigin: 'left' }}
                      transition={{ duration: 1, ease: POWER3_OUT, delay: 0.15 }}
                    />
                  </div>
                  <span className="font-mono text-xs tabular-nums text-muted">
                    {detail.level}
                  </span>
                </div>

                {detail.links.length > 0 ? (
                  <p className="mt-5 text-xs text-muted">
                    Works with{' '}
                    {detail.links
                      .map((id) => SKILL_BY_ID[id]?.name)
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                ) : null}
              </motion.article>
            ) : (
              <motion.p
                key="empty"
                className="glass rounded-2xl p-7 text-meta text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                Ten capabilities orbit in the galaxy behind this panel. Select one here or in
                the scene to see how it is used in practice.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SectionShell>
  );
}
