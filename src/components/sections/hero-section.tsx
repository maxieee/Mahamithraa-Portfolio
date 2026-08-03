'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { PROFILE, SOCIALS } from '@/lib/content/profile';
import { POWER4_OUT } from '@/lib/motion';
import { useUi } from '@/lib/store';
import { useScrollApi } from '@/components/providers/smooth-scroll-provider';
import { useMagnetic } from '@/hooks/use-magnetic';
import { Button } from '@/components/ui/button';

/**
 * Landing panel.
 *
 * The headline is rendered here as a real <h1> (the 3D title in the canvas is
 * the same words, but decorative) so search engines and screen readers get the
 * page's actual heading.
 */
export function HeroSection() {
  const ready = useUi((s) => s.ready);
  const scroll = useScrollApi();
  const primaryRef = useMagnetic<HTMLButtonElement>({ strength: 0.3 });
  const secondaryRef = useMagnetic<HTMLButtonElement>({ strength: 0.24 });

  const show = ready ? 'show' : 'hidden';

  return (
    <section
      id="landing"
      aria-labelledby="landing-title"
      className="pointer-events-none relative z-10 flex min-h-[100svh] w-full flex-col justify-end px-6 pb-16 pt-32 lg:px-10 lg:pb-20"
    >
      <motion.div
        aria-label="Portrait placeholder for Mahamithraa Gupta"
        className="pointer-events-auto absolute right-6 top-24 grid size-28 place-items-center rounded-full border border-accent/35 bg-surface/55 p-2 shadow-[0_0_45px_rgba(59,130,246,0.2)] backdrop-blur-xl sm:right-10 sm:top-28 sm:size-36 lg:right-[12%] lg:top-[18%] lg:size-44"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.9, ease: POWER4_OUT, delay: 0.4 }}
      >
        <span className="absolute inset-1 rounded-full border border-white/10" />
        <span className="absolute inset-3 rounded-full bg-gradient-to-br from-accent/25 via-transparent to-glow/15" />
        <span className="relative grid size-12 place-items-center rounded-full border border-accent/30 bg-void/60 text-lg font-semibold tracking-tight text-white sm:size-16 sm:text-2xl">
          MG
        </span>
        <Sparkles aria-hidden="true" className="absolute bottom-3 right-2 size-3 text-glow sm:bottom-4 sm:right-3" />
      </motion.div>

      <div className="pointer-events-auto mx-auto flex w-full max-w-[1440px] flex-col gap-14">
        <motion.div
          className="flex flex-col gap-7"
          initial="hidden"
          animate={show}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } } }}
        >
          <motion.p
            className="eyebrow"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 1, ease: POWER4_OUT } },
            }}
          >
            {PROFILE.role} &middot; {PROFILE.location}
          </motion.p>

          {/* The visible headline lives in the canvas; this h1 carries it for
              assistive tech and crawlers without duplicating it on screen. */}
          <h1 id="landing-title" className="sr-only">
            {PROFILE.name} — Think. Solve. Lead. {PROFILE.role} across{' '}
            {PROFILE.disciplines.join(', ')}.
          </h1>

          <motion.p
            aria-hidden="true"
            className="max-w-2xl text-pretty text-body text-muted"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: POWER4_OUT } },
            }}
          >
            {PROFILE.tagline}
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 24 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.1, ease: POWER4_OUT, delay: 0.5 }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button
              ref={primaryRef}
              size="lg"
              onClick={() => scroll.scrollToSection('projects')}
            >
              View the work
              <ArrowUpRight aria-hidden="true" />
            </Button>
            <Button
              ref={secondaryRef}
              variant="glass"
              size="lg"
              onClick={() => scroll.scrollToSection('contact')}
            >
              Start a conversation
            </Button>
          </div>

          <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {SOCIALS.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 text-meta text-muted transition-colors duration-300 hover:text-white"
                >
                  {social.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 transition-transform duration-300 ease-power3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Scroll affordance. */}
        <motion.button
          type="button"
          onClick={() => scroll.scrollToSection('about')}
          className="group mx-auto flex flex-col items-center gap-3 text-muted transition-colors hover:text-white"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.2, ease: POWER4_OUT, delay: 1 }}
        >
          <span className="text-eyebrow uppercase">Begin the journey</span>
          <ArrowDown
            aria-hidden="true"
            className="size-4 animate-drift transition-transform duration-300 group-hover:translate-y-1"
          />
        </motion.button>
      </div>
    </section>
  );
}
