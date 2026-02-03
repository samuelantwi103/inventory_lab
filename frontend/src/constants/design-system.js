/**
 * Design System Tokens
 * Unique, minimal design system with intentional color choices
 */

export const COLORS = {
  // Refined monochrome palette - The foundation
  slate: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Single accent color - Sophisticated indigo
  accent: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  
  // Minimal status colors - Only when needed
  status: {
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
  },
};

export const TYPOGRAPHY = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
    display: 'system-ui, -apple-system, sans-serif',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.8125rem',    // 13px - Refined
    base: '0.9375rem',  // 15px - Refined
    lg: '1.0625rem',    // 17px - Refined
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '2rem',      // 32px - Refined
    '4xl': '2.5rem',    // 40px - Refined
    '5xl': '3.5rem',    // 56px - Refined
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
};

export const SPACING = {
  xs: '0.5rem',     // 8px
  sm: '0.75rem',    // 12px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
};

export const SHADOWS = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.06)',
  DEFAULT: '0 2px 4px -1px rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.12)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)',
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const TRANSITIONS = {
  fast: '120ms cubic-bezier(0.4, 0, 0.2, 1)',
  default: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '500ms cubic-bezier(0.4, 0, 0.1, 1)',
};

export const RADIUS = {
  none: '0',
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.625rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
};
