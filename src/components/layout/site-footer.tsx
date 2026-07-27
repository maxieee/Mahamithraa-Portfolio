'use client';

import { ArrowUp } from 'lucide-react';
import { PROFILE, SOCIALS } from '@/lib/content/profile';
import { useScrollApi } from '@/components/providers/smooth-scroll-provider';

export function SiteFooter() {
  const scroll = useScrollApi();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-hairline bg-void/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="text-base font-semibold text-white">{PROFILE.name}</p>
          <p className="mt-1 text-meta text-muted">
            Think. Solve. Lead. &mdash; {PROFILE.disciplines.join(' · ')}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
          {SOCIALS.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-meta text-muted transition-colors hover:text-white"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <p className="text-xs text-muted">&copy; {year} {PROFILE.name}</p>
          <button
            type="button"
            onClick={() => scroll.scrollToSection('landing')}
            className="glass flex size-11 items-center justify-center rounded-full text-white transition-colors hover:border-accent/40"
            aria-label="Back to the top"
          >
            <ArrowUp aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
