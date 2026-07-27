import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="flex max-w-lg flex-col items-center gap-7 text-center">
        <p className="font-mono text-7xl font-light tabular-nums text-accent">404</p>
        <h1 className="text-heading text-white">This part of the world does not exist.</h1>
        <p className="text-meta leading-relaxed text-muted">
          The journey runs from the landing scene through to contact — nothing branches off here.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            Back to the beginning
          </Link>
        </Button>
      </div>
    </main>
  );
}
