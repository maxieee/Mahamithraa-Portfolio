import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PROFILE } from '@/lib/content/profile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.').max(200),
  organisation: z.string().trim().max(160).optional().default(''),
  message: z
    .string()
    .trim()
    .min(20, 'Please give me a little more detail — 20 characters minimum.')
    .max(4000),
  /** Honeypot: real users never fill this in. */
  website: z.string().max(0).optional().default(''),
});

/**
 * Fixed-window rate limit, per instance.
 *
 * Deliberately in-memory: this endpoint is low-volume and a serverless instance
 * living for minutes is enough to stop casual abuse. For a multi-region deploy,
 * swap this for a shared store — the call sites do not change.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; expires: number }>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.expires < now) {
    hits.set(key, { count: 1, expires: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

/** Drops expired buckets so the map cannot grow without bound. */
function sweep() {
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (entry.expires < now) hits.delete(key);
  }
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Delivers via Resend when `RESEND_API_KEY` is configured.
 *
 * With no key set the submission is accepted and validated but not delivered —
 * the response says so explicitly and the UI falls back to a prefilled mailto,
 * so the form is never a dead end.
 */
async function deliver(payload: z.infer<typeof ContactSchema>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? PROFILE.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) return false;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email,
      subject: `Portfolio enquiry — ${payload.name}`,
      html: `
        <h2>New portfolio enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        ${payload.organisation ? `<p><strong>Organisation:</strong> ${escapeHtml(payload.organisation)}</p>` : ''}
        <hr />
        <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
      `,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend responded ${response.status}: ${detail}`);
  }

  return true;
}

export async function POST(request: Request) {
  sweep();

  if (!rateLimit(clientKey(request))) {
    return NextResponse.json(
      { ok: false, error: 'Too many messages from this address. Please try again later.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request body.' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { ok: false, error: 'Please check the highlighted fields.', fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot tripped — accept silently so bots learn nothing from the response.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  try {
    const delivered = await deliver(parsed.data);
    return NextResponse.json({ ok: true, delivered });
  } catch (error) {
    console.error('[contact] delivery failed:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'The message could not be delivered. Please email me directly.',
      },
      { status: 502 },
    );
  }
}
