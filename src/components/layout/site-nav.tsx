'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { PROFILE } from '@/lib/content/profile';
import { SECTIONS } from '@/lib/content/sections';
import { useUi } from '@/lib/store';
import { cn } from '@/lib/utils';
import { POWER3_OUT, POWER4_OUT } from '@/lib/motion';
import { useScrollApi } from '@/components/providers/smooth-scroll-provider';
import { useMagnetic } from '@/hooks/use-magnetic';
import { Button } from '@/components/ui/button';
import type { SectionId } from '@/types';

/**
 * Fixed navigation. Anchors are real links to the section elements, so the site
 * remains navigable with JavaScript disabled and screen readers see a normal
 * in-page nav; the click handler upgrades them to the cinematic camera flight.
 */
export function SiteNav() {
  const activeSection = useUi((s) => s.activeSection);
  const ready = useUi((s) => s.ready);
  const scroll = useScrollApi();
  const [open, setOpen] = useState(false);
  const contactRef = useMagnetic<HTMLAnchorElement>({ strength: 0.28 });

  const go = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
      // Let modified clicks behave normally (new tab, etc.).
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      scroll.scrollToSection(id);
      setOpen(false);
    },
    [scroll],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -20 }}
      transition={{ duration: 1, ease: POWER4_OUT, delay: 0.2 }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-10"
      >
        <a
          href="#landing"
          onClick={(event) => go(event, 'landing')}
          className="group flex items-center gap-3"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-accent" />
            <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            {PROFILE.name}
          </span>
        </a>

        {/* Desktop section links. */}
        <ul className="hidden items-center gap-1 lg:flex">
          {SECTIONS.filter((section) => section.id !== 'landing').map((section) => {
            const active = activeSection === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(event) => go(event, section.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'relative block rounded-full px-4 py-2 text-sm transition-colors duration-300 ease-power3',
                    active ? 'text-white' : 'text-muted hover:text-white',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-accent/30 bg-accent/10"
                      transition={{ duration: 0.6, ease: POWER3_OUT }}
                    />
                  ) : null}
                  <span className="relative">{section.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Button asChild variant="glass" size="sm" className="hidden sm:inline-flex">
            <a ref={contactRef} href="#contact" onClick={(event) => go(event, 'contact')}>
              Get in touch
            </a>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="glass flex size-11 items-center justify-center rounded-full text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="glass-strong mx-6 overflow-hidden rounded-2xl lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: POWER4_OUT }}
          >
            <ul className="flex flex-col p-3">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => go(event, section.id)}
                    className={cn(
                      'flex items-baseline justify-between rounded-xl px-4 py-3 text-base transition-colors',
                      activeSection === section.id
                        ? 'bg-accent/10 text-white'
                        : 'text-muted hover:bg-white/[0.04] hover:text-white',
                    )}
                  >
                    <span>{section.label}</span>
                    <span className="font-mono text-xs text-muted">
                      {String(section.index + 1).padStart(2, '0')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
