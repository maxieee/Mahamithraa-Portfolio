'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Route-level error boundary. Keeps the visual language of the site rather than
 * dropping to a browser default, and offers a real recovery path.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[route] unhandled error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass flex max-w-lg flex-col gap-6 rounded-2xl p-10 text-center">
        <p className="text-eyebrow uppercase text-accent">Something broke</p>
        <h1 className="text-heading text-white">The experience hit an error.</h1>
        <p className="text-meta leading-relaxed text-muted">
          This is on my side, not yours. Reloading the scene usually clears it.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted">Reference: {error.digest}</p>
        ) : null}
        <div className="mt-2 flex justify-center">
          <Button onClick={reset}>
            <RotateCcw aria-hidden="true" />
            Reload the experience
          </Button>
        </div>
      </div>
    </main>
  );
}
