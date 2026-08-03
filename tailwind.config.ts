import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', lg: '2.5rem', '2xl': '4rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        void: '#050816',
        surface: '#0B1220',
        card: '#111827',
        muted: '#9CA3AF',
        accent: {
          DEFAULT: '#3B82F6',
          soft: '#60A5FA',
          deep: '#1D4ED8',
        },
        glow: {
          DEFAULT: '#67E8F9',
          soft: '#A5F3FC',
        },
        hairline: 'rgba(148, 163, 184, 0.14)',
      },
      fontFamily: {
        sans: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Editorial scale — fluid, clamps between mobile and desktop.
        display: ['clamp(3rem, 9vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.04em', fontWeight: '900' }],
        'display-sm': ['clamp(2.25rem, 6vw, 3.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em', fontWeight: '800' }],
        heading: ['clamp(1.875rem, 4vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        subheading: ['clamp(1.25rem, 2.2vw, 1.5rem)', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '600' }],
        body: ['clamp(1rem, 1.3vw, 1.25rem)', { lineHeight: '1.65', letterSpacing: '-0.01em' }],
        meta: ['0.9375rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.24em', fontWeight: '600' }],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, rgba(5,8,22,0) 0%, rgba(5,8,22,0.85) 70%, #050816 100%)',
        'accent-sweep':
          'linear-gradient(115deg, transparent 20%, rgba(59,130,246,0.18) 45%, rgba(103,232,249,0.14) 55%, transparent 80%)',
      },
      boxShadow: {
        glass: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 80px -32px rgba(2,6,23,0.9)',
        'accent-glow': '0 0 0 1px rgba(59,130,246,0.35), 0 20px 60px -24px rgba(59,130,246,0.55)',
      },
      transitionTimingFunction: {
        power3: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        power4: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
      keyframes: {
        'fade-rise': {
          from: { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'sheen': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'pulse-ring': {
          '0%': { opacity: '0.55', transform: 'scale(0.85)' },
          '70%': { opacity: '0', transform: 'scale(1.6)' },
          '100%': { opacity: '0', transform: 'scale(1.6)' },
        },
        'drift': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-rise': 'fade-rise 0.9s cubic-bezier(0.215, 0.61, 0.355, 1) both',
        sheen: 'sheen 1.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.165, 0.84, 0.44, 1) infinite',
        drift: 'drift 7s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
};

export default config;
