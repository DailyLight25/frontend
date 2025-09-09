export const theme = {
  colors: {
    primary: {
      main: '#1E3A8A', // Deep Royal Blue
      light: '#3B82F6',
      dark: '#1E40AF',
    },
    secondary: {
      main: '#059669', // Emerald Green
      light: '#10B981',
      dark: '#047857',
    },
    accent: {
      main: '#FFD700', // Warm Gold
      light: '#FDE047',
      dark: '#F59E0B',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      light: '#9CA3AF',
    },
  },
  gradients: {
    primary: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
    secondary: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    accent: 'linear-gradient(135deg, #F59E0B 0%, #FFD700 100%)',
    hero: 'linear-gradient(135deg, #1E3A8A 0%, #FFFFFF 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgba(255, 215, 0, 0.3)',
    glowBlue: '0 0 20px rgba(30, 58, 138, 0.3)',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, -apple-system, sans-serif',
      secondary: 'Poppins, system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
} as const;

export type Theme = typeof theme;