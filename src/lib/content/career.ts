import type {
  Achievement,
  Certification,
  ExperienceEntry,
  Milestone,
} from '@/types';

export const MILESTONES: Milestone[] = [
  {
    id: 'school-pupil-leader',
    title: 'School Pupil Leader',
    organisation: 'School',
    period: 'Early',
    description:
      'First formal responsibility for people rather than tasks. Learned that authority without credibility is noise — and that showing up first is most of the job.',
  },
  {
    id: 'class-representative',
    title: 'Class Representative',
    organisation: 'Undergraduate',
    period: 'Undergrad',
    description:
      'The translation layer between a cohort and its faculty. Ran the feedback loop both ways and learned to represent a position I did not always personally hold.',
  },
  {
    id: 'tedx',
    title: 'TEDx Coordinator',
    organisation: 'TEDx',
    period: 'Undergrad',
    description:
      'Speaker curation, run-of-show and the hundred small logistics that decide whether an event feels effortless. Production is invisible when it works.',
  },
  {
    id: 'mba-president',
    title: 'President',
    organisation: 'MBA Leadership Council',
    period: 'Current',
    description:
      'Leading the council: setting the agenda, distributing ownership across portfolios and building an operating cadence the next cohort can inherit.',
  },
  {
    id: 'future',
    title: 'Next',
    organisation: 'Business Analyst · Strategy · Founder\'s Office',
    period: 'Ahead',
    description:
      'Looking for a team where analysis is close enough to the decision to change it — and where owning the outcome is part of the role.',
    future: true,
  },
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'president',
    role: 'President',
    company: 'MBA Leadership Council',
    period: 'Current',
    location: 'Coimbatore',
    summary:
      'Lead the student leadership council — governance, event portfolio and the operating cadence across committees.',
    achievements: [
      'Restructured the council into owned portfolios with a named lead and a weekly reporting rhythm',
      'Introduced a written runbook standard so events survive leadership handover',
      'Chaired the review cycle that turned ad-hoc event planning into a term-level calendar',
    ],
  },
  {
    id: 'finance-intern',
    role: 'Finance Intern',
    company: 'Hanon Systems',
    period: 'Internship',
    location: 'Automotive components',
    summary:
      'Supported the finance function on reconciliation, reporting and variance analysis in a manufacturing environment.',
    achievements: [
      'Reconciled ledger postings against operational records and traced the recurring sources of mismatch',
      'Built reusable workbook templates that cut repeated manual formatting out of the monthly cycle',
      'Prepared variance commentary translating cost movements into operational causes, not just numbers',
    ],
  },
  {
    id: 'industrial-training',
    role: 'Industrial Training',
    company: 'Sri Kannapiran Mills',
    period: 'Training',
    location: 'Textile manufacturing',
    summary:
      'Floor-level exposure to a working production line — process flow, throughput constraints and inventory movement.',
    achievements: [
      'Mapped the end-to-end production flow and documented where material actually waits',
      'Observed shift-level throughput variation and tied it back to changeover and staffing patterns',
      'Learned to read a factory: the difference between the process on paper and the process in practice',
    ],
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'lean-six-sigma',
    name: 'Lean Six Sigma',
    issuer: 'Process excellence',
    year: 'Certified',
    focus: 'Process improvement',
    credentialSummary:
      'DMAIC problem structuring, waste identification and control planning — the toolkit for making a process improvement stick after the project ends.',
  },
  {
    id: 'google-data-analytics',
    name: 'Google Data Analytics',
    issuer: 'Google',
    year: 'Certified',
    focus: 'Analytics',
    credentialSummary:
      'End-to-end analysis workflow: ask, prepare, process, analyse, share, act — with emphasis on cleaning and defensible visualisation.',
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain',
    issuer: 'Operations',
    year: 'Certified',
    focus: 'Supply chain',
    credentialSummary:
      'Demand planning, inventory policy and network trade-offs — how service level, cost and working capital pull against each other.',
  },
  {
    id: 'power-bi-cert',
    name: 'Power BI',
    issuer: 'Business intelligence',
    year: 'Certified',
    focus: 'Data visualisation',
    credentialSummary:
      'Data modelling, DAX measures and report design aimed at decision speed rather than chart count.',
  },
  {
    id: 'project-management',
    name: 'Project Management',
    issuer: 'Delivery',
    year: 'Certified',
    focus: 'Delivery',
    credentialSummary:
      'Scope, schedule and stakeholder management — planning to a critical path and communicating slippage before it becomes a surprise.',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'champion-batch',
    title: 'Champion of the Batch',
    context: 'Academic cohort',
    year: 'Awarded',
    detail:
      'Recognised across the cohort for combined academic and leadership contribution — the award is decided on both, not either.',
    form: 'cup',
  },
  {
    id: 'tedx-coordinator',
    title: 'TEDx Coordinator',
    context: 'TEDx',
    year: 'Delivered',
    detail:
      'Coordinated speaker curation and run-of-show for a TEDx event, from first outreach through to stage.',
    form: 'star',
  },
  {
    id: 'president-award',
    title: 'President',
    context: 'MBA Leadership Council',
    year: 'Elected',
    detail:
      'Elected to lead the leadership council — the mandate is governance and cadence, not ceremony.',
    form: 'obelisk',
  },
  {
    id: 'national-kabaddi',
    title: 'National Kabaddi',
    context: 'National level',
    year: 'Represented',
    detail:
      'Competed at national level in kabaddi. Team sport at that intensity teaches something no case study does: how to hold a position under real pressure.',
    form: 'ring',
  },
];
