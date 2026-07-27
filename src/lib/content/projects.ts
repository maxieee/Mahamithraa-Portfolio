import type { Project } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'macro-risk',
    title: 'Global Macroeconomic Risk Analysis',
    subtitle: 'Country risk scoring for capital allocation',
    year: '2025',
    discipline: 'Research · Finance',
    challenge:
      'Investment discussions kept stalling on vibes. Country exposure was argued anecdotally — one person cited inflation, another cited politics — with no shared basis for comparing two markets side by side.',
    approach:
      'Built a weighted risk index across four pillars: monetary stability, fiscal headroom, external balance and policy volatility. Pulled multi-year indicator series, normalised them to comparable z-scores, then stress-tested the weighting so a single noisy input could not swing a country\'s rank. Findings were delivered as a one-page ranking with a drill-down appendix.',
    tools: ['Python', 'Excel', 'Power BI', 'Public macro datasets'],
    outcome:
      'A repeatable scoring model that ranks markets on a single comparable scale, with sensitivity bands that make the uncertainty explicit instead of hiding it. Reduced a recurring multi-hour debate to a fifteen-minute review against a shared baseline.',
    metrics: [
      { label: 'Markets scored', value: '20+' },
      { label: 'Risk pillars', value: '4' },
      { label: 'Review time', value: '−75%' },
    ],
    image: '/images/projects/macro-risk.svg',
    accent: '#3B82F6',
  },
  {
    id: 'forum-points',
    title: 'Forum Points League Dashboard',
    subtitle: 'Participation analytics for a 400-member forum',
    year: '2024',
    discipline: 'Analytics · Product',
    challenge:
      'Engagement across the student forum was tracked in scattered spreadsheets. Nobody could answer basic questions — which cohorts were actually participating, which events drove sustained involvement, who was quietly dropping off.',
    approach:
      'Designed a points schema that rewarded consistency over one-off attendance, consolidated event logs into a single star-schema model, and built a Power BI dashboard with cohort leaderboards, participation trends and a drop-off watchlist. Automated the refresh so organisers stopped hand-collating results after every event.',
    tools: ['Power BI', 'Excel', 'SQL', 'DAX'],
    outcome:
      'One live source of truth for participation. Organisers could see decay in a cohort within a week rather than at end of term, and the leaderboard itself became a driver of turnout.',
    metrics: [
      { label: 'Members tracked', value: '400+' },
      { label: 'Manual collation', value: 'Eliminated' },
      { label: 'Refresh cadence', value: 'Automated' },
    ],
    image: '/images/projects/forum-points.svg',
    accent: '#67E8F9',
  },
  {
    id: 'buddy-mentorship',
    title: 'Buddy Mentorship',
    subtitle: 'Structured peer mentoring programme',
    year: '2024',
    discipline: 'Programme Design · Operations',
    challenge:
      'Incoming students were landing without a reliable point of contact. Informal mentoring existed but was unevenly distributed — the students who most needed support were least likely to ask for it.',
    approach:
      'Designed a matching model pairing juniors with seniors on academic track, language comfort and stated goals, rather than leaving pairing to chance. Defined a light-touch cadence — structured first meeting, fortnightly check-ins, a defined escalation path — and instrumented the programme with a short pulse survey so problem pairs surfaced early.',
    tools: ['Excel', 'Process design', 'Survey instrumentation', 'Stakeholder management'],
    outcome:
      'A mentoring programme that runs on a defined cadence instead of goodwill, with visibility into which pairs are working. Handed over with documentation so it survives a leadership handover.',
    metrics: [
      { label: 'Pairs matched', value: '120+' },
      { label: 'Check-in cadence', value: 'Fortnightly' },
      { label: 'Handover', value: 'Documented' },
    ],
    image: '/images/projects/buddy-mentorship.svg',
    accent: '#A5F3FC',
  },
  {
    id: 'kct-business-league',
    title: 'KCT Business League',
    subtitle: 'Multi-round inter-college business competition',
    year: '2025',
    discipline: 'Operations · Leadership',
    challenge:
      'A multi-round competition across several colleges, with judges, rooms, scoring and schedules to coordinate — and a previous edition where scoring disputes had eaten into the event itself.',
    approach:
      'Ran it like an operation. Built the round structure and schedule as a dependency plan, standardised judging into a weighted rubric with anonymised scoring sheets, set up a live tabulation model that produced round results within minutes of submission, and briefed volunteers against a written runbook.',
    tools: ['Excel', 'Operations planning', 'Rubric design', 'Volunteer coordination'],
    outcome:
      'Rounds ran to schedule and results were published the same day with an auditable score trail. Zero scoring disputes reached escalation — the rubric and anonymised sheets settled them before they started.',
    metrics: [
      { label: 'Rounds delivered', value: '4' },
      { label: 'Result turnaround', value: 'Same day' },
      { label: 'Escalated disputes', value: '0' },
    ],
    image: '/images/projects/kct-business-league.svg',
    accent: '#60A5FA',
  },
];

export const PROJECT_BY_ID = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
