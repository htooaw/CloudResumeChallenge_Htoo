import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Operator console palette — warm dark with phosphor amber
        ink: {
          0: '#0a0a0b',   // deepest background
          1: '#0f0f11',   // base background
          2: '#15151a',   // cards / raised surfaces
          3: '#1c1c22',   // borders / dividers
          4: '#2a2a32',   // hover borders
        },
        bone: {
          0: '#ededed',   // primary text
          1: '#a8a8ad',   // secondary text
          2: '#6b6b72',   // muted text
          3: '#42424a',   // disabled / faintest
        },
        amber: {
          glow: '#f5b840',     // primary accent (phosphor)
          dim:  '#8a6420',     // dimmed accent
          ghost: '#f5b84015',  // 8% alpha for soft highlights
        },
        signal: {
          green: '#7ec96e',  // status: ok
          red: '#e85d5d',    // status: alert
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        // Tighter mono leading
        'mono-xs': ['0.75rem', { lineHeight: '1.4' }],
        'mono-sm': ['0.8125rem', { lineHeight: '1.55' }],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
      animation: {
        'blink': 'blink 1.1s step-end infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scan': 'scan 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
