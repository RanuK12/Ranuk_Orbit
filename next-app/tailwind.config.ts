import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0A',
          soft: '#1A1A1A',
        },
        celestial: {
          DEFAULT: '#F7F7F5',
          warm: '#EDEAE3',
        },
        desert: '#C9A227',
        oceanic: '#1E6FA4',
        alpine: '#8FA8C0',
        forest: '#2D7A4A',
        dusk: '#6B4C7F',
        line: {
          DEFAULT: 'rgba(247, 247, 245, 0.12)',
          strong: 'rgba(247, 247, 245, 0.28)',
        },
      },
      fontFamily: {
        display: ['var(--font-italiana)', 'serif'],
        ui: ['var(--font-marcellus)', 'serif'],
        italic: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-dm-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.5em',
      },
      maxWidth: {
        page: '1440px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'char-in': 'charIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'ken-burns': 'kenBurns 18s ease-in-out both',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        charIn: {
          '0%': { opacity: '0', transform: 'translateY(0.6em)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1.12)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
