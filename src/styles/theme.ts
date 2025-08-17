// theme.ts
export const theme = {
  colors: {
    main: {
      100: '#FFF8E5',
      200: '#FFF1CC',
      300: '#FFE299',
      400: '#FFD56B',
      500: '#FFC533',
      600: '#FFB700',
      700: '#B28000',
      800: '#996E00',
      900: '#805B00',
    },
    sub: {
      500: '#A7E9C3',
    },
    point: {
      500: '#4D9DE0',
    },
    grey: {
      100: '#F0F0F0',
      200: '#E8E8E8',
      300: '#DDDDDD',
      400: '#A5A5A5',
      500: '#666666',
      600: '#4D4D4D',
      700: '#373737',
      800: '#2E2E2E',
      900: '#191919',
    },
    white: {
      0: '#FFFFFF',
      100: '#FFFDF8',
      200: '#FDF6EC',
    },
    black: {
      0: '#000000',
    },
    warning: {
      500: '#FF5C33',
    },
  },

  typography: {
    // Title
    titleBold22: {
      fontSize: '22px',
      lineHeight: '32px',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    titleSemi18: {
      fontSize: '18px',
      lineHeight: '24px',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    titleSemi14: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },

    // Body / Semibold
    bodySemi14: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    bodySemi13: {
      fontSize: '13px',
      lineHeight: '20px',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },

    // Body / Medium
    bodyMed18: { fontSize: '18px', lineHeight: '24px', fontWeight: 500, letterSpacing: '-0.025em' },
    bodyMed16: { fontSize: '16px', lineHeight: '24px', fontWeight: 500, letterSpacing: '-0.025em' },
    bodyMed13: { fontSize: '13px', lineHeight: '20px', fontWeight: 500, letterSpacing: '-0.025em' },

    // Body / Regular
    bodyReg18: { fontSize: '18px', lineHeight: '27px', fontWeight: 400, letterSpacing: '-0.025em' },
    bodyReg14: { fontSize: '14px', lineHeight: '20px', fontWeight: 400, letterSpacing: '-0.025em' },

    // Caption
    captionMed12: {
      fontSize: '12px',
      lineHeight: '18px',
      fontWeight: 500,
      letterSpacing: '-0.025em',
    },
    captionBold11: {
      fontSize: '11px',
      lineHeight: '16px',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
  },

  // spacing scale (추천)
  space: [0, 2, 4, 8, 12, 16, 24, 32, 48, 64],

  radius: {},

  shadow: {},

  breakpoint: {},
} as const;

export type AppTheme = typeof theme;
