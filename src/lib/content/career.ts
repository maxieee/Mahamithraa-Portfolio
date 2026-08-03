import type {
  Achievement,
  Certification,
  ExperienceEntry,
  Milestone,
} from '@/types';

export const MILESTONES: Milestone[] = [
  {
    id: 'School-pupil-leader',
    title: 'School Pupil Leader',
    organisation: 'Amrita Vidyalayam',
    period: '2019 - 2020',
    description:
      'First formal responsibility for people rather than tasks. Learned that authority without credibility is noise and that showing up first is most of the job.',
    proofUrl: 'https://drive.google.com/drive/u/1/folders/1EZXVfGTRQtwW8aqNQLDWczDsGsOl5o2X',
  },
  {
    id: 'UG class-representative',
    title: 'UG Class Representative',
    organisation: 'NGP Arts & Science College',
    period: '2021 - 2024',
    description:
      'The translation layer between a cohort and its faculty. Ran the feedback loop both ways and learned to represent a position I did not always personally hold.',
    proofUrl: '#',
  },
  {
    id: 'MBA Leadership Council',
    title: 'President',
    organisation: 'KCT Business School',
    period: 'Aug 2025 - Jun 2026',
    description:
      'Leading the council: setting the agenda, distributing ownership across portfolios and building an operating cadence the next cohort can inherit.',
    proofUrl: 'https://drive.google.com/file/d/1vI5Mqc7QkEboFkNF4-XZn3Fqoez1k1x9/view?usp=sharing',
  },
  {
    id: 'future',
    title: 'Next',
    organisation: 'Business Analyst | Strategy | Founder\'s Office | Finance & Operations',
    period: 'Ahead',
    description:
      'Looking for a team where analysis is close enough to the decision to change it and where owning the outcome is part of the role.',
    future: true,
    proofUrl: '#',
  },
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'finance-executive',
    role: 'Finance Executive',
    company: 'Sri Venkataramana Transport & Logistics',
    period: 'Jul 2026 - Present',
    location: 'India',
    summary:
      'Supported the FP&A function through financial reporting, business analysis, budgeting support, and performance tracking to improve strategic decision making.',
    achievements: [
      'Developed financial reports and KPI dashboards',
      'Performed financial analysis supporting budgeting and forecasting',
      'Collaborated across teams to improve reporting efficiency',
    ],
    certificateUrl: '#',
  },
  {
    id: 'president',
    role: 'President',
    company: 'MBA Leadership Council',
    period: 'Aug 2025 - Jun 2026',
    location: 'Coimbatore',
    summary:
      'Lead the student leadership council governance, event portfolio and the operating cadence across committees.',
    achievements: [
      'Restructured the council into owned portfolios with a named lead and a weekly reporting rhythm',
      'Introduced a written runbook standard so events survive leadership handover',
      'Chaired the review cycle that turned ad-hoc event planning into a term-level calendar',
    ],
    certificateUrl: 'https://drive.google.com/drive/folders/1E9FsSAk7yf0oIj5qXloB6NyAwjMnor3x?usp=drive_link',
  },
  {
    id: 'finance-intern',
    role: 'Finance Intern',
    company: 'Hanon Systems Automotive Systems Pvt Ltd',
    period: 'Jun 2025 - Aug 2025',
    location: 'Chennai',
    summary:
      'Supported the finance function on reconciliation, reporting and variance analysis in a manufacturing environment.',
    achievements: [
      'Reconciled ledger postings against operational records and traced the recurring sources of mismatch',
      'Built reusable workbook templates that cut repeated manual formatting out of the monthly cycle',
      'Prepared variance commentary translating cost movements into operational causes, not just numbers',
    ],
    certificateUrl: 'https://drive.google.com/file/d/1d3YwhtWsmUznSTOOuGIgYPazEe2HTQkS/view',
  },
  {
    id: 'industrial-training',
    role: 'Industrial Training',
    company: 'Sri Kannapiran Mills',
    period: 'Jun 2023',
    location: 'Textile manufacturing',
    summary:
      'Floor-level exposure to a working production line process flow, throughput constraints and inventory movement.',
    achievements: [
      'Mapped the end-to-end production flow and documented where material actually waits',
      'Observed shift-level throughput variation and tied it back to changeover and staffing patterns',
      'Learned to read a factory: the difference between the process on paper and the process in practice',
    ],
    certificateUrl: ' https://drive.google.com/file/d/1JwrKdFsXEzlsBrzAX2FpNgtO_DKeAw3S/view',
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'lean-six-sigma',
    name: 'Lean Six Sigma (Black Belt & Green Belt)',
    issuer: 'AIGPE',
    year: 'Certified',
    focus: 'Process improvement',
    credentialSummary:
      'DMAIC problem structuring, waste identification and control planning the toolkit for making a process improvement stick after the project ends.',
    verificationUrl: 'https://drive.google.com/file/d/1iKYeOeo5WOLg6e6xx9bjur7vjM4bHmiN/view',
  },
  {
    id: 'Google-data-analytics',
    name: 'Google Data Analytics',
    issuer: 'Google - Coursera',
    year: 'Certified',
    focus: 'Analytics',
    credentialSummary:
      'End-to-end analysis workflow: ask, prepare, process, analyse, share, act with emphasis on cleaning and defensible visualisation.',
    verificationUrl: 'https://drive.google.com/file/d/1zHUZ35nvW8UqcuM59tnuXov9R7ujaCaQ/view',
  },
  {
    id: 'Supply-chain Management',
    name: 'Supply Chain Management Specialization',
    issuer: 'Rutgers University - Coursera',
    year: 'Certified',
    focus: 'Supply chain',
    credentialSummary:
      'Demand planning, inventory policy and network trade-offs how service level, cost and working capital pull against each other.',
    verificationUrl: 'https://drive.google.com/file/d/1jvUYlKsHbw9pQ7Qr56Mb42YtTjmQgZud/view',
  },
  {
    id: 'Power-bi',
    name: 'Power BI Fundamentals',
    issuer: 'Corporate Finance Institute - Coursera ',
    year: 'Certified',
    focus: 'Data visualisation',
    credentialSummary:
      'Data modelling, DAX measures and report design aimed at decision speed rather than chart count.',
    verificationUrl: 'https://drive.google.com/file/d/1RwlNQA4gcgUwEJR3b5XiGFpnciMTPRav/view',
  },
  {
    id: 'Google Project Management ',
    name: 'Google Project Management ',
    issuer: 'Google - Coursera',
    year: 'Certified',
    focus: 'Project Management',
    credentialSummary:
      'Scope, schedule and stakeholder management planning to a critical path and communicating slippage before it becomes a surprise.',
    verificationUrl: 'https://drive.google.com/file/d/1zHUZ35nvW8UqcuM59tnuXov9R7ujaCaQ/view',
  },
  {
    id: 'Lean Mangement ',
    name: 'Lean Management Specialist & Expert',
    issuer: 'AIGPE',
    year: 'Certified',
    focus: 'Lean',
    credentialSummary:
      'Developed expertise in Lean Management principles to eliminate waste, improve process efficiency, optimize workflows, and drive continuous improvement across business operations.',
    verificationUrl: ' https://drive.google.com/file/d/1iKYeOeo5WOLg6e6xx9bjur7vjM4bHmiN/view',
  },
  {
    id: 'Excel ',
    name: 'Excel Skills for Business Specialization',
    issuer: 'Macquarie University - Coursera',
    year: 'Certified',
    focus: 'Excel',
    credentialSummary:
      'Gained practical expertise in Microsoft Excel for data analysis, reporting, dashboard creation, advanced formulas, PivotTables, and business decision support.',
    verificationUrl: 'https://drive.google.com/file/d/1RwlNQA4gcgUwEJR3b5XiGFpnciMTPRav/view',
  },
  {
    id: 'NISM ',
    name: 'NISM V-A Mutual Fund Distributors Certification',
    issuer: 'NISM',
    year: 'Certified',
    focus: 'Mutual Fund',
    credentialSummary:
      'Gained a strong foundation in capital markets, investment products, securities regulations, and financial market operations through NISM certification.',
    verificationUrl: 'https://drive.google.com/file/d/12twrDLemePxhOaW0rIvA7gMAAfKF-INj/view',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'champion-batch',
    title: 'Champion of the Batch',
    context: 'Achievers Day 2026',
    year: 'Awarded',
    detail:
      'Recognised across the cohort for combined academic and leadership contribution the award is decided on both, not either.',
    form: 'cup',
    proofUrl: 'https://drive.google.com/drive/folders/1oyUZwU15KSys7SRmwHZV0o5Mx7UbhkSz?usp=drive_link',
  },
  {
    id: 'Angadi',
    title: 'Overall Championship Winner',
    context: 'Angadi 2025',
    year: 'Awarded',
    detail:
      'Led the team to secure the Overall Winner title at Angadi by driving strategic planning, effective execution, teamwork, and profitable business operations.',
    form: 'ring',
    proofUrl: 'https://drive.google.com/drive/folders/1UbTKUaGtjGHOSIWJjyEIw8XfSfYs2AgR?usp=drive_link',
  },
  {
    id: 'president-award',
    title: 'President',
    context: 'MBA Leadership Council',
    year: 'Elected',
    detail:
      'Elected to lead the leadership council the mandate is governance and cadence, not ceremony.',
    form: 'obelisk',
    proofUrl: 'https://drive.google.com/drive/folders/1E9FsSAk7yf0oIj5qXloB6NyAwjMnor3x?usp=drive_link',
  },
  {
    id: 'Cluster VI Kabaddi',
    title: 'Cluster VI Kabaddi Championship Winner',
    context: 'Cluster VI Kabaddi  (2018 & 2019) ',
    year: 'Winner',
    detail:
      'Won the Cluster Level Kabaddi Championship through outstanding teamwork, strategic gameplay, discipline, and consistent performance under competitive conditions.',
    form: 'ring',
    proofUrl: 'https://drive.google.com/drive/folders/1YDrM98NxXJhy7aNz1ut9NuD6GiB5d93K?usp=drive_link',
  },
  {
    id: 'national-kabaddi',
    title: 'National Kabaddi Participant',
    context: 'National Kabaddi (2018 & 2019) ',
    year: 'Represented',
    detail:
      'Competed at national level in kabaddi. Team sport at that intensity teaches something no case study does: how to hold a position under real pressure.',
    form: 'ring',
    proofUrl: 'https://drive.google.com/drive/folders/1YDrM98NxXJhy7aNz1ut9NuD6GiB5d93K?usp=drive_link',
  },
];
