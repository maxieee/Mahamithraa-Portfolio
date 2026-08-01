'use client';

import { PROFILE } from '@/lib/content/profile';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { SectionShell } from './section-shell';
import { Badge } from '@/components/ui/badge';

const PRINCIPLES = [
  {
    title: 'Lead with the answer',
    body: 'A readout opens with the recommendation. The method belongs in the appendix, where the people who want it will find it.',
  },
  {
    title: 'Instrument before you argue',
    body: 'Most disagreements are really about missing numbers. Build the measure first and the debate usually resolves itself.',
  },
  {
    title: 'Design for the handover',
    body: 'Work that only functions while I am running it is unfinished. Documentation and cadence are part of the deliverable.',
  },
];

export function AboutSection() {
  const meta = SECTION_BY_ID.about;

  return (
    <SectionShell
      id="about"
      index={meta.index}
      eyebrow={meta.eyebrow}
      width="wide"
      title={
        <>
          I build the clarity that lets
          <br />
          teams decide quickly.
        </>
      }
      lede={PROFILE.summary}
    >
      <div className="flex flex-col gap-10">
        <ul className="flex flex-wrap gap-2" aria-label="Focus areas">
          {PROFILE.disciplines.map((discipline) => (
            <li key={discipline}>
              <Badge variant="accent">{discipline}</Badge>
            </li>
          ))}
        </ul>

        <dl className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title} className="bg-surface/70 p-6 backdrop-blur-xl">
              <dt className="text-subheading text-white">{principle.title}</dt>
              <dd className="mt-3 text-meta leading-relaxed text-muted">{principle.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </SectionShell>
  );
}
