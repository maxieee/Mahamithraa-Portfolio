import { ImageResponse } from 'next/og';
import { PROFILE } from '@/lib/content/profile';

export const runtime = 'edge';
export const alt = `${PROFILE.name} — Think. Solve. Lead.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Social card, generated at request time.
 *
 * Uses only the system font stack available to Satori by default, so the card
 * renders without shipping a font binary to the edge runtime.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#050816',
          backgroundImage:
            'radial-gradient(circle at 20% 0%, rgba(29,78,216,0.45) 0%, transparent 55%), radial-gradient(circle at 90% 100%, rgba(14,116,144,0.35) 0%, transparent 55%)',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: '#3B82F6',
              }}
            />
            <div style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 600 }}>{PROFILE.name}</div>
          </div>
          <div style={{ color: '#9CA3AF', fontSize: 22, letterSpacing: 4 }}>PORTFOLIO</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 132,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -6,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Think.</span>
            <span>Solve.</span>
            <span style={{ color: '#3B82F6' }}>Lead.</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ color: '#9CA3AF', fontSize: 26, maxWidth: 640 }}>
            {PROFILE.disciplines.join('  ·  ')}
          </div>
          <div
            style={{
              display: 'flex',
              height: 4,
              width: 220,
              background: 'linear-gradient(90deg, #3B82F6 0%, #67E8F9 100%)',
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
