/**
 * Generates the project case-study placeholder artwork.
 *
 * These are deliberately abstract, on-palette diagrams rather than stock
 * photography: each one is a schematic of the project it fronts. Re-run with
 * `node scripts/generate-placeholders.mjs` after editing.
 *
 * Swap any file in `public/images/projects/` for a real screenshot and the site
 * picks it up with no code change.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public/images/projects');

const W = 1200;
const H = 750;

const frame = (accent, id, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Abstract diagram">
  <defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1220"/>
      <stop offset="60%" stop-color="#050816"/>
      <stop offset="100%" stop-color="#0B1220"/>
    </linearGradient>
    <linearGradient id="sweep-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid-${id}" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#94A3B8" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#grid-${id})"/>
  <rect width="${W}" height="${H}" fill="url(#glow-${id})"/>
  ${body}
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${accent}" stroke-opacity="0.22"/>
  <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#sweep-${id})"/>
</svg>
`;

/** Ranked bars — a country risk league table. */
function macroRisk(accent) {
  const values = [0.92, 0.81, 0.74, 0.66, 0.58, 0.5, 0.43, 0.34, 0.27, 0.19];
  const bars = values
    .map((value, index) => {
      const y = 120 + index * 52;
      const width = value * 780;
      return `<g>
      <rect x="180" y="${y}" width="780" height="22" fill="#94A3B8" fill-opacity="0.06" rx="11"/>
      <rect x="180" y="${y}" width="${width}" height="22" fill="${accent}" fill-opacity="${0.22 + value * 0.5}" rx="11"/>
      <circle cx="${180 + width}" cy="${y + 11}" r="5" fill="${accent}"/>
      <rect x="120" y="${y + 6}" width="${34 + (index % 3) * 12}" height="10" fill="#94A3B8" fill-opacity="0.18" rx="5"/>
    </g>`;
    })
    .join('\n');
  return `${bars}
  <line x1="180" y1="96" x2="180" y2="${120 + values.length * 52}" stroke="${accent}" stroke-opacity="0.3"/>
  <rect x="120" y="60" width="200" height="14" fill="#FFFFFF" fill-opacity="0.22" rx="7"/>`;
}

/** Leaderboard + participation trend. */
function forumPoints(accent) {
  const points = [0.22, 0.35, 0.3, 0.48, 0.44, 0.62, 0.58, 0.74, 0.8, 0.71, 0.88];
  const path = points
    .map((value, index) => {
      const x = 120 + index * 78;
      const y = 560 - value * 340;
      return `${index === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`;
    })
    .join(' ');
  const area = `${path} L ${120 + (points.length - 1) * 78} 560 L 120 560 Z`;
  const dots = points
    .map((value, index) => {
      const x = 120 + index * 78;
      const y = 560 - value * 340;
      return `<circle cx="${x}" cy="${y.toFixed(1)}" r="6" fill="#050816" stroke="${accent}" stroke-width="2.5"/>`;
    })
    .join('\n');

  const rows = [0, 1, 2, 3]
    .map(
      (index) => `<g transform="translate(120, ${610 + index * 30})">
      <rect width="${180 - index * 26}" height="10" fill="${accent}" fill-opacity="${0.5 - index * 0.09}" rx="5"/>
    </g>`,
    )
    .join('\n');

  return `<path d="${area}" fill="${accent}" fill-opacity="0.1"/>
  <path d="${path}" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  ${dots}
  <line x1="120" y1="560" x2="1080" y2="560" stroke="#94A3B8" stroke-opacity="0.2"/>
  <rect x="120" y="70" width="240" height="14" fill="#FFFFFF" fill-opacity="0.22" rx="7"/>
  ${rows}`;
}

/** Paired nodes — the mentorship matching graph. */
function buddyMentorship(accent) {
  const pairs = [0, 1, 2, 3, 4, 5];
  const content = pairs
    .map((index) => {
      const y = 140 + index * 92;
      const wobble = (index % 3) * 26;
      return `<g>
      <line x1="330" y1="${y}" x2="${820 + wobble}" y2="${y + (index % 2 === 0 ? 34 : -34)}" stroke="${accent}" stroke-opacity="0.32" stroke-width="2"/>
      <circle cx="330" cy="${y}" r="17" fill="#0B1220" stroke="${accent}" stroke-width="2.5"/>
      <circle cx="${820 + wobble}" cy="${y + (index % 2 === 0 ? 34 : -34)}" r="13" fill="${accent}" fill-opacity="0.6"/>
    </g>`;
    })
    .join('\n');
  return `${content}
  <rect x="120" y="70" width="210" height="14" fill="#FFFFFF" fill-opacity="0.22" rx="7"/>
  <text x="300" y="700" fill="#94A3B8" fill-opacity="0.35" font-family="sans-serif" font-size="22" letter-spacing="6">MENTOR · MENTEE</text>`;
}

/** Bracket — the competition round structure. */
function businessLeague(accent) {
  const lines = [];
  const columns = [
    { x: 180, count: 8 },
    { x: 460, count: 4 },
    { x: 740, count: 2 },
    { x: 1000, count: 1 },
  ];

  columns.forEach((column, columnIndex) => {
    const gap = 640 / column.count;
    for (let i = 0; i < column.count; i += 1) {
      const y = 110 + gap * i + gap / 2;
      lines.push(
        `<rect x="${column.x - 70}" y="${y - 15}" width="140" height="30" rx="15" fill="#0B1220" stroke="${accent}" stroke-opacity="${0.25 + columnIndex * 0.2}" stroke-width="2"/>`,
      );
      if (columnIndex < columns.length - 1) {
        const next = columns[columnIndex + 1];
        const nextGap = 640 / next.count;
        const nextY = 110 + nextGap * Math.floor(i / 2) + nextGap / 2;
        lines.push(
          `<path d="M${column.x + 70} ${y} H${(column.x + next.x) / 2} V${nextY} H${next.x - 70}" fill="none" stroke="${accent}" stroke-opacity="0.24" stroke-width="2"/>`,
        );
      }
    }
  });

  return `${lines.join('\n')}
  <circle cx="1000" cy="430" r="46" fill="none" stroke="${accent}" stroke-opacity="0.4" stroke-width="2"/>
  <rect x="120" y="50" width="230" height="14" fill="#FFFFFF" fill-opacity="0.22" rx="7"/>`;
}

const FILES = [
  { name: 'macro-risk.svg', accent: '#3B82F6', id: 'a', draw: macroRisk },
  { name: 'forum-points.svg', accent: '#67E8F9', id: 'b', draw: forumPoints },
  { name: 'buddy-mentorship.svg', accent: '#A5F3FC', id: 'c', draw: buddyMentorship },
  { name: 'kct-business-league.svg', accent: '#60A5FA', id: 'd', draw: businessLeague },
];

await mkdir(OUT_DIR, { recursive: true });

for (const file of FILES) {
  const svg = frame(file.accent, file.id, file.draw(file.accent));
  await writeFile(resolve(OUT_DIR, file.name), svg, 'utf8');
  console.log(`wrote ${file.name}`);
}
