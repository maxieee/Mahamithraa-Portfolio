'use client';

import { useCallback, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Loader2, Mail } from 'lucide-react';
import { PROFILE, SOCIALS } from '@/lib/content/profile';
import { SECTION_BY_ID } from '@/lib/content/sections';
import { POWER3_OUT } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { useMagnetic } from '@/hooks/use-magnetic';
import { SectionShell } from './section-shell';
import { Button } from '@/components/ui/button';

type Status = 'idle' | 'sending' | 'sent' | 'fallback' | 'error';

interface FieldErrors {
  name?: string[];
  email?: string[];
  organisation?: string[];
  message?: string[];
}

const FIELD_CLASS =
  'w-full rounded-xl border border-hairline bg-white/[0.03] px-4 py-3.5 text-base text-white placeholder:text-muted/70 transition-colors duration-300 focus:border-accent/50 focus:bg-white/[0.05]';

export function ContactSection() {
  const meta = SECTION_BY_ID.contact;
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const submitRef = useMagnetic<HTMLButtonElement>({ strength: 0.26 });

  const onSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus('sending');
    setErrors({});
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as {
        ok: boolean;
        delivered?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok || !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setStatus('error');
        setMessage(result.error ?? 'Something went wrong. Please try again.');
        return;
      }

      form.reset();

      if (result.delivered) {
        setStatus('sent');
        setMessage('Message received. I will come back to you shortly.');
      } else {
        // The server validated it but has no mail transport configured.
        setStatus('fallback');
        setMessage('This deployment has no mail service connected yet — send it directly instead:');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection or email me directly.');
    }
  }, []);

  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent('Portfolio enquiry')}`;

  return (
    <SectionShell
      id="contact"
      index={meta.index}
      eyebrow={meta.eyebrow}
      width="full"
      title={
        <>
          Tell me what you are
          <br />
          trying to figure out.
        </>
      }
      lede={PROFILE.availability}
    >
      <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <form ref={formRef} id={formId} onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          {/* Honeypot — visually and semantically hidden from real users. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor={`${formId}-website`}>Leave this empty</label>
            <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor={`${formId}-name`} className="text-eyebrow uppercase text-muted">
                Name
              </label>
              <input
                id={`${formId}-name`}
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                className={cn(FIELD_CLASS, errors.name && 'border-red-500/60')}
              />
              {errors.name ? (
                <p id={`${formId}-name-error`} className="text-xs text-red-400">
                  {errors.name[0]}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={`${formId}-email`} className="text-eyebrow uppercase text-muted">
                Email
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                className={cn(FIELD_CLASS, errors.email && 'border-red-500/60')}
              />
              {errors.email ? (
                <p id={`${formId}-email-error`} className="text-xs text-red-400">
                  {errors.email[0]}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-organisation`} className="text-eyebrow uppercase text-muted">
              Organisation <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id={`${formId}-organisation`}
              name="organisation"
              type="text"
              autoComplete="organization"
              placeholder="Company or team"
              className={FIELD_CLASS}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`${formId}-message`} className="text-eyebrow uppercase text-muted">
              Message
            </label>
            <textarea
              id={`${formId}-message`}
              name="message"
              required
              rows={5}
              placeholder="The role, the problem, or just what caught your attention."
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${formId}-message-error` : undefined}
              className={cn(FIELD_CLASS, 'resize-y', errors.message && 'border-red-500/60')}
            />
            {errors.message ? (
              <p id={`${formId}-message-error`} className="text-xs text-red-400">
                {errors.message[0]}
              </p>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Button ref={submitRef} type="submit" size="lg" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <>
                  <Loader2 aria-hidden="true" className="animate-spin" />
                  Sending
                </>
              ) : status === 'sent' ? (
                <>
                  <Check aria-hidden="true" />
                  Sent
                </>
              ) : (
                <>
                  Send message
                  <ArrowUpRight aria-hidden="true" />
                </>
              )}
            </Button>

            <a
              href={mailto}
              className="inline-flex items-center gap-2 text-meta text-muted transition-colors hover:text-white"
            >
              <Mail aria-hidden="true" className="size-4" />
              {PROFILE.email}
            </a>
          </div>

          {/* Status region — announced to screen readers on change. */}
          <div aria-live="polite" className="min-h-[1.5rem]">
            <AnimatePresence mode="wait">
              {message ? (
                <motion.p
                  key={message}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: POWER3_OUT }}
                  className={cn(
                    'text-meta',
                    status === 'error' && 'text-red-400',
                    status === 'sent' && 'text-glow',
                    status === 'fallback' && 'text-muted',
                  )}
                >
                  {message}{' '}
                  {status === 'fallback' ? (
                    <a href={mailto} className="text-accent underline underline-offset-4">
                      {PROFILE.email}
                    </a>
                  ) : null}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </form>

        <div className="flex flex-col gap-8">
          <ul className="flex flex-col gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline">
            {SOCIALS.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between gap-4 bg-surface/70 px-6 py-5 backdrop-blur-xl transition-colors duration-300 hover:bg-surface"
                >
                  <span>
                    <span className="block text-base font-semibold text-white">{social.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{social.handle}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted transition-all duration-300 ease-power3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </a>
              </li>
            ))}
            <li>
              <a
                href={mailto}
                className="group flex items-center justify-between gap-4 bg-surface/70 px-6 py-5 backdrop-blur-xl transition-colors duration-300 hover:bg-surface"
              >
                <span>
                  <span className="block text-base font-semibold text-white">Email</span>
                  <span className="mt-0.5 block text-xs text-muted">{PROFILE.email}</span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 text-muted transition-all duration-300 ease-power3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </a>
            </li>
          </ul>

          <p className="text-pretty text-meta leading-relaxed text-muted">
            Based in {PROFILE.location}. Happy to talk about analyst and strategy roles, or about a
            problem you are already stuck on — the second conversation is usually the more useful one.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
