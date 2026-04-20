/**
 * CareerUp Africa Design System
 * Brand colors and design tokens based on brand guide
 */

export const colors = {
  // Primary brand colors
  navy: '#1E3A8A',
  teal: '#14B8A6',
  orange: '#F97316',
  white: '#FFFFFF',
  charcoal: '#0F172A',
  lightBlue: '#E0F2FE',

  // Semantic colors
  primary: '#1E3A8A', // Navy
  secondary: '#14B8A6', // Teal
  accent: '#F97316', // Orange
  
  // Status colors
  success: '#14B8A6', // Teal - competence achieved
  warning: '#F97316', // Orange - needs attention
  error: '#DC2626',
  info: '#1E3A8A', // Navy
  
  // Background colors
  background: '#FFFFFF',
  backgroundAlt: '#E0F2FE',
  surface: '#FFFFFF',
  
  // Text colors
  textPrimary: '#0F172A', // Charcoal
  textSecondary: '#64748B',
  textOnDark: '#FFFFFF',
  textOnNavy: '#FFFFFF',
  textOnTeal: '#FFFFFF',
  textOnOrange: '#FFFFFF',
  
  // Border colors
  border: '#E2E8F0',
  borderHover: '#CBD5E1',
  borderFocus: '#14B8A6',
}

export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Courier New", monospace',
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
}

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
}

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
}

// Helper function to create consistent button styles
export const buttonStyles = {
  primary: {
    background: colors.navy,
    color: colors.white,
    hoverBackground: '#1e40af',
  },
  secondary: {
    background: colors.teal,
    color: colors.white,
    hoverBackground: '#0f766e',
  },
  accent: {
    background: colors.orange,
    color: colors.white,
    hoverBackground: '#ea580c',
  },
  outline: {
    background: 'transparent',
    color: colors.navy,
    border: `1px solid ${colors.navy}`,
    hoverBackground: colors.lightBlue,
  },
}

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  transitions,
  buttonStyles,
}

export default theme
