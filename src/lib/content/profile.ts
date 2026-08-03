import type { SocialLink } from '@/types';

export const PROFILE = {
  name: 'Mahamithraa Gupta',
  shortName: 'Mahamithraa',
  headline: ['Think.', 'Solve.', 'Lead.'] as const,
  role: 'Operations & Finance Professional',
  disciplines: ['Operations', 'Finance', 'Leadership'] as const,
  location: 'Coimbatore, India',
  tagline:
    'I turn ambiguous business problems into decisions leadership can act on through analysis, operating rhythm and the discipline to ship.',
  summary:
    'I thrive at the intersection of business, operations, finance, and strategy. By transforming complex data into meaningful insights, I help organizations make confident decisions, optimize processes, improve performance, and drive sustainable growth. My approach combines analytical thinking, operational excellence, and collaborative leadership to deliver measurable business impact.',
  availability: 'Open to Business Analyst, Strategy & Founder\'s Office roles',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'mahamithraa010@gmail.com',
} as const;

export const SOCIALS: SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mahamithraa-g',
    handle: '/in/mahamithraa-g',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/maxieee',
    handle: '@maxieee',
  },
  {
    id: 'fueler',
    label: 'Fueler',
    href: 'https://fueler.io/mahamithraag/timeline',
    handle: '/mahamithraag',
  },
];

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mahamithraa.vercel.app',
  title: 'Mahamithraa Gupta | Think. Solve. Lead.',
  description:
    'Interactive 3D portfolio of Mahamithraa Gupta, a business analyst working across operations, finance, and leadership. Case studies in macroeconomic risk, analytics dashboards, and programme design.',
  keywords: [
    'Mahamithraa Gupta',
    'Business Analyst',
    'Operations Analyst',
    'Finance',
    'Power BI',
    'SQL',
    'Business Analysis Portfolio',
    'MBA Leadership',
  ],
} as const;
