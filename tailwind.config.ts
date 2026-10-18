import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        mist: 'var(--mist)',
        line: 'var(--line)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-soft': 'var(--ink-soft)',
        stone: 'var(--stone)',
        taupe: 'var(--taupe)',
        'taupe-deep': 'var(--taupe-deep)',
        ember: 'var(--ember)',
        'ember-deep': 'var(--ember-deep)',
        'ember-wash': 'var(--ember-wash)',
        violet: 'var(--violet)',
        'violet-deep': 'var(--violet-deep)',
        'violet-wash': 'var(--violet-wash)',
      },
      fontFamily: {
        sans: ['"Geist Variable"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        h1: [
          'clamp(3.4rem, 0.8rem + 10.5vw, 10.5rem)',
          { lineHeight: '0.94', letterSpacing: '-0.045em', fontWeight: '500' },
        ],
        h2: [
          'clamp(2.6rem, 0.8rem + 6vw, 7rem)',
          { lineHeight: '0.96', letterSpacing: '-0.04em', fontWeight: '500' },
        ],
        h3: [
          'clamp(1.75rem, 1rem + 2.2vw, 3rem)',
          { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '500' },
        ],
        lead: [
          'clamp(1.2rem, 1rem + 0.7vw, 1.75rem)',
          { lineHeight: '1.45', letterSpacing: '-0.015em', fontWeight: '400' },
        ],
        body: [
          'clamp(1.0625rem, 1rem + 0.2vw, 1.25rem)',
          { lineHeight: '1.55', fontWeight: '400' },
        ],
      },
      borderRadius: {
        card: '28px',
        'card-sm': '22px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20,21,26,0.04), 0 24px 60px -24px rgba(20,21,26,0.18)',
        pill: '0 1px 2px rgba(20,21,26,0.04), 0 12px 32px -12px rgba(20,21,26,0.10)',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        container: '1680px',
      },
    },
  },
  plugins: [],
};

export default config;
