'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { CERTIFICATIONS } from '@/lib/content/career';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { setUi, useUi } from '@/lib/store';
import { POWER3_OUT } from '@/lib/motion';
import { SectionShell } from './section-shell';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function CertificationsSection() {
  const meta = SECTION_BY_ID.certifications;
  const openCertificate = useUi((s) => s.openCertificate);
  const active = CERTIFICATIONS.find((item) => item.id === openCertificate);

  const onOpenChange = useCallback((next: boolean) => {
    if (!next) setUi({ openCertificate: null });
  }, []);

  return (
    <>
      <SectionShell
        id="certifications"
        index={meta.index}
        eyebrow={meta.eyebrow}
        width="full"
        title={
          <>
            Formal training behind
            <br />
            the instinct.
          </>
        }
        lede="These courses gave structure to skills I use in real work. They helped me strengthen my foundations in analysis, process improvement, project delivery, and finance."
      >
        <ul className="mt-4 grid max-w-3xl gap-4 sm:grid-cols-3">
          {CERTIFICATIONS.map((certification, index) => (
            <motion.li
              key={certification.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: POWER3_OUT, delay: index * 0.05 }}
            >
              <button
                type="button"
                onClick={() => setUi({ openCertificate: certification.id })}
                aria-haspopup="dialog"
                className="glass group flex h-full w-full flex-col items-start gap-4 rounded-2xl p-6 text-left transition-[border-color,box-shadow,transform] duration-500 ease-power3 hover:-translate-y-1 hover:border-glow/40 hover:shadow-accent-glow"
              >
                <span className="flex size-10 items-center justify-center rounded-full border border-glow/30 bg-glow/10 text-glow">
                  <ShieldCheck aria-hidden="true" className="size-4" />
                </span>

                <span className="flex flex-col gap-1">
                  <span className="text-base font-semibold leading-snug text-white">
                    {certification.name}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-muted">
                    {certification.focus}
                  </span>
                </span>

                <Badge className="mt-auto">{certification.year}</Badge>
              </button>
            </motion.li>
          ))}
        </ul>
      </SectionShell>

      <Dialog open={Boolean(active)} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          {active ? (
            <div>
              <DialogHeader>
                <p className="text-eyebrow uppercase text-glow">{active.focus}</p>
                <DialogTitle>{active.name}</DialogTitle>
                <DialogDescription>{active.issuer}</DialogDescription>
              </DialogHeader>

              <div className="mt-7 rounded-xl border border-glow/25 bg-gradient-to-br from-surface to-void p-8">
                <p className="text-eyebrow uppercase text-muted">Credential</p>
                <p className="mt-4 text-pretty leading-relaxed text-white/90">
                  {active.credentialSummary}
                </p>
                <p className="mt-6 border-t border-hairline pt-4 text-xs uppercase tracking-widest text-muted">
                  {active.year}
                </p>
                <a
                  href={active.verificationUrl ?? '#'}
                  target={active.verificationUrl && active.verificationUrl !== '#' ? '_blank' : undefined}
                  rel={active.verificationUrl && active.verificationUrl !== '#' ? 'noreferrer noopener' : undefined}
                  title={active.verificationUrl === '#' ? 'Credential link to be added' : undefined}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-glow transition-colors hover:text-white"
                >
                  Verify Credential
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </a>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
