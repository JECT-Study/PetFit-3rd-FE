// src/styles/theme.ts

const fontFamily = 'Pretendard, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

export const theme = {
  color: {
    main: {
      100: 'var(--main-100)',
      200: 'var(--main-200)',
      300: 'var(--main-300)',
      400: 'var(--main-400)',
      500: 'var(--main-500)',
      600: 'var(--main-600)',
      700: 'var(--main-700)',
      800: 'var(--main-800)',
      900: 'var(--main-900)',
    },
    gray: {
      50: 'var(--gray-50)',
      100: 'var(--gray-100)',
      200: 'var(--gray-200)',
      300: 'var(--gray-300)',
      400: 'var(--gray-400)',
      500: 'var(--gray-500)',
      600: 'var(--gray-600)',
      700: 'var(--gray-700)',
      800: 'var(--gray-800)',
      900: 'var(--gray-900)',
    },
    white: 'var(--white)',
    black: 'var(--black)',
    sub: { 500: 'var(--sub-500)', 500_30: 'var(--sub-500-30)' },
    warning: { 500: 'var(--warning-500)', 500_30: 'var(--warning-500-30)' },
  },

  radius: { sm: '8px', md: '12px', lg: '16px' },
  space: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },

  // Figma 텍스트 스타일을 shorthand로 고정
  typography: {
    title: {
      bold22: { font: `700 1.375rem/145% ${fontFamily}`, letterSpacing: '-0.03438rem' },
      semi18: { font: `600 1.125rem/135% ${fontFamily}`, letterSpacing: '-0.02813rem' },
      semi14: { font: `600 0.875rem/145% ${fontFamily}`, letterSpacing: '-0.02188rem' },
    },
    body: {
      semi14: { font: `600 0.875rem/145% ${fontFamily}`, letterSpacing: '-0.02188rem' },
      semi13: { font: `600 0.8125rem/150% ${fontFamily}`, letterSpacing: '-0.02031rem' },
      med18: { font: `500 1.125rem/135% ${fontFamily}`, letterSpacing: '-0.02813rem' },
      med16: { font: `500 1rem/150% ${fontFamily}`, letterSpacing: '-0.025rem' },
      med13: { font: `500 0.8125rem/150% ${fontFamily}`, letterSpacing: '-0.02031rem' },
      reg18: { font: `400 1.125rem/150% ${fontFamily}`, letterSpacing: '-0.02813rem' },
      reg14: { font: `400 0.875rem/145% ${fontFamily}`, letterSpacing: '-0.02188rem' },
    },
    caption: {
      med12: { font: `500 0.75rem/150% ${fontFamily}`, letterSpacing: '-0.01875rem' },
      bold11: { font: `700 0.6875rem/145% ${fontFamily}`, letterSpacing: '-0.01719rem' },
    },
  },
} as const;

export type AppTheme = typeof theme;
