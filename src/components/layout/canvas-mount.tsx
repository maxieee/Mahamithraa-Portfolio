'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode } from 'react';

/**
 * The WebGL bundle is loaded only in the browser and only after the shell has
 * painted. `ssr: false` keeps three.js out of the server bundle entirely, which
 * is the difference between a fast first paint and a slow one.
 */
const WorldCanvas = dynamic(
  () => import('@/components/canvas/world-canvas').then((mod) => mod.WorldCanvas),
  {
    ssr: false,
    loading: () => <CanvasBackdrop />,
  },
);

/** Static stand-in shown while the 3D bundle loads, and if WebGL is absent. */
function CanvasBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="grain absolute inset-0 bg-void"
      style={{
        backgroundImage:
          'radial-gradient(120% 80% at 50% 0%, rgba(29,78,216,0.22) 0%, transparent 55%), radial-gradient(80% 60% at 15% 90%, rgba(14,116,144,0.18) 0%, transparent 60%)',
      }}
    />
  );
}

interface BoundaryState {
  failed: boolean;
}

/**
 * If WebGL is unavailable or the renderer dies, the site degrades to the static
 * backdrop and every section stays fully readable — the 3D layer is an
 * enhancement, never a requirement.
 */
class CanvasBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  override state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  override componentDidCatch(error: Error) {
    console.error('[canvas] falling back to static backdrop:', error);
  }

  override render() {
    return this.state.failed ? <CanvasBackdrop /> : this.props.children;
  }
}

export function CanvasMount() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Only the canvas itself takes pointer events, so DOM content above it
          stays fully interactive. */}
      <div className="pointer-events-auto absolute inset-0">
        <CanvasBoundary>
          <WorldCanvas />
        </CanvasBoundary>
      </div>
    </div>
  );
}
