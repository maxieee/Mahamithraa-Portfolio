import type { SocialLink } from '@/types';

export const PROFILE = {
  name: 'Mahamithraa Gupta',
  shortName: 'Mahamithraa',
  headline: ['Think.', 'Solve.', 'Lead.'] as const,
  role: 'Business Analyst',
  disciplines: ['Business Analysis', 'Operations', 'Finance', 'Leadership'] as const,
  location: 'Coimbatore, India',
  tagline:
    'I turn ambiguous business problems into decisions leadership can act on — through analysis, operating rhythm and the discipline to ship.',
  summary:
    'Business analyst working at the intersection of operations, finance and leadership. I build the models, dashboards and operating cadence that let teams see clearly and move quickly — then I lead the people who run them.',
  availability: 'Open to Business Analyst, Strategy & Founder\'s Office roles',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'lathaguptha19s@gmail.com',
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
  title: 'Mahamithraa Gupta — Think. Solve. Lead.',
  description:
    'Interactive 3D portfolio of Mahamithraa Gupta — Business Analyst working across operations, finance and leadership. Case studies in macroeconomic risk, analytics dashboards and programme design.',
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
