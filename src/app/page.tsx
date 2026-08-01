import { ExperienceShell } from '@/components/layout/experience-shell';

/**
 * Single-page journey.
 *
 * Content is authored as static React on the server; only the interaction
 * layer (smooth scroll, canvas, motion) hydrates on the client.
 */
export default function HomePage() {
  return <ExperienceShell />;
}
