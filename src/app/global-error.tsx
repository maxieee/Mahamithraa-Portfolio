'use client';

import { useEffect } from 'react';

/**
 * Last-resort boundary — catches failures in the root layout itself, so it must
 * render its own <html> and cannot rely on global styles being present.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global] unhandled error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050816',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            The page failed to load.
          </h1>
          <p style={{ color: '#9CA3AF', lineHeight: 1.6, marginTop: '1rem' }}>
            Something went wrong before the experience could start.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '2rem',
              background: '#3B82F6',
              color: '#fff',
              border: 0,
              borderRadius: 999,
              padding: '0.85rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
