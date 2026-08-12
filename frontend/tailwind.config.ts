import type { Config } from 'tailwindcss'

// ---------------------------------------------------------------------------
// AEGIS INTELLIGENCE — unified design token system
// Single source of truth for color, type, radius and spacing across every
// page. Derived from the canonical Stitch DESIGN.md, normalized into one
// coherent dark enterprise theme (no more per-page palettes).
// ---------------------------------------------------------------------------

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '24px',
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0b0c',
          raised: '#0d0f10',
        },
        surface: {
          DEFAULT: '#121414',
          low: '#0f1112',
          high: '#1a1c1c',
          highest: '#232525',
          overlay: 'rgba(18,20,20,0.72)',
        },
        border: {
          DEFAULT: '#26282a',
          strong: '#34373a',
          subtle: '#1a1c1d',
        },
        ink: {
          DEFAULT: '#e9e8e6',
          muted: '#a3a099',
          faint: '#6b6863',
          onAccent: '#12160a',
        },
        accent: {
          DEFAULT: '#c6f135',
          dim: '#9fc41f',
          bright: '#dbff5c',
          container: '#1c220a',
        },
        success: {
          DEFAULT: '#7ed957',
          container: '#132110',
        },
        warning: {
          DEFAULT: '#f5a623',
          container: '#221a0a',
        },
        danger: {
          DEFAULT: '#ff5c5c',
          container: '#220f0f',
        },
        info: {
          DEFAULT: '#4ea1ff',
          container: '#0a1a22',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        h3: ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        label: ['11px', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        gutter: '24px',
        'container-max': '1440px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.02) inset',
        elevated: '0 8px 24px rgba(0,0,0,0.45)',
        glow: '0 0 0 1px rgba(198,241,53,0.25), 0 0 24px rgba(198,241,53,0.15)',
      },
      transitionDuration: {
        DEFAULT: '160ms',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(198,241,53,0)' },
          '50%': { boxShadow: '0 0 16px 3px rgba(198,241,53,0.35)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.2s cubic-bezier(0.4,0,0.6,1) infinite',
        blink: 'blink 1s step-end infinite',
        'fade-in': 'fade-in 160ms ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
