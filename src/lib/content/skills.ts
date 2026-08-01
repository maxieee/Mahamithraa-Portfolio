import type { Skill } from '@/types';

/**
 * The skill galaxy. `orbit` values are hand-tuned so nodes never collide at
 * the default camera distance, and `links` produce the animated constellation.
 */
export const SKILLS: Skill[] = [
  {
    id: 'business-analysis',
    name: 'Business Analysis',
    category: 'domain',
    level: 95,
    summary:
      'Requirement discovery, process mapping and decision frameworks that translate messy business context into a specification teams can build against.',
    links: ['operations', 'sql', 'problem-solving', 'power-bi'],
    orbit: { radius: 0, inclination: 0, phase: 0, speed: 0.06 },
  },
  {
    id: 'operations',
    name: 'Operations',
    category: 'domain',
    level: 90,
    summary:
      'Throughput, capacity and cost-to-serve. Building the weekly operating rhythm that keeps a function measurable and predictable.',
    links: ['excel', 'sap', 'leadership'],
    orbit: { radius: 3.4, inclination: 0.18, phase: 0.0, speed: 0.09 },
  },
  {
    id: 'power-bi',
    name: 'Power BI',
    category: 'tooling',
    level: 88,
    summary:
      'Semantic models, DAX measures and executive dashboards designed for a single glance — not a data dump.',
    links: ['excel', 'sql'],
    orbit: { radius: 3.6, inclination: -0.34, phase: 0.9, speed: 0.085 },
  },
  {
    id: 'excel',
    name: 'Excel',
    category: 'tooling',
    level: 93,
    summary:
      'Three-statement models, scenario trees and sensitivity analysis. Fast, auditable, reviewer-friendly workbooks.',
    links: ['power-bi', 'sql'],
    orbit: { radius: 4.6, inclination: 0.42, phase: 1.8, speed: 0.07 },
  },
  {
    id: 'python',
    name: 'Python',
    category: 'tooling',
    level: 76,
    summary:
      'pandas and statsmodels for data cleaning, exploratory analysis and repeatable reporting pipelines.',
    links: ['sql', 'problem-solving'],
    orbit: { radius: 4.9, inclination: -0.15, phase: 2.7, speed: 0.062 },
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'tooling',
    level: 84,
    summary:
      'Window functions, CTEs and query tuning to get trustworthy numbers out of production systems.',
    links: ['power-bi', 'python'],
    orbit: { radius: 3.9, inclination: 0.52, phase: 3.5, speed: 0.095 },
  },
  {
    id: 'sap',
    name: 'SAP',
    category: 'tooling',
    level: 72,
    summary:
      'MM and FICO transaction flows — reading master data, reconciling postings and mapping them to operational reality.',
    links: ['operations', 'excel'],
    orbit: { radius: 5.4, inclination: -0.46, phase: 4.4, speed: 0.055 },
  },
  {
    id: 'leadership',
    name: 'Leadership',
    category: 'human',
    level: 94,
    summary:
      'Running councils and committees: setting direction, distributing ownership and holding a standard without micromanaging.',
    links: ['communication', 'operations'],
    orbit: { radius: 4.2, inclination: 0.28, phase: 5.2, speed: 0.078 },
  },
  {
    id: 'communication',
    name: 'Communication',
    category: 'human',
    level: 92,
    summary:
      'Executive summaries, stakeholder readouts and the discipline to lead with the recommendation rather than the method.',
    links: ['leadership', 'business-analysis'],
    orbit: { radius: 5.1, inclination: 0.06, phase: 0.45, speed: 0.068 },
  },
  {
    id: 'problem-solving',
    name: 'Problem Solving',
    category: 'human',
    level: 91,
    summary:
      'Hypothesis-led structuring — MECE issue trees, driver decomposition and knowing which analysis will actually change the decision.',
    links: ['business-analysis', 'python'],
    orbit: { radius: 3.2, inclination: -0.6, phase: 1.3, speed: 0.102 },
  },
];

export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

export const SKILL_CATEGORY_LABEL: Record<Skill['category'], string> = {
  domain: 'Domain',
  tooling: 'Tooling',
  human: 'Human',
};

/** Deduplicated undirected edge list for the constellation lines. */
export const SKILL_EDGES: [string, string][] = (() => {
  const seen = new Set<string>();
  const edges: [string, string][] = [];
  for (const skill of SKILLS) {
    for (const link of skill.links) {
      if (!SKILL_BY_ID[link]) continue;
      const key = [skill.id, link].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([skill.id, link]);
    }
  }
  return edges;
})();
