// src/styles/typography.ts
import { css } from 'styled-components';

import type { AppTheme } from '@/styles/theme';

type CSSChunk = ReturnType<typeof css>;

export const tx = {
  title: <K extends keyof AppTheme['typography']['title']>(k: K): CSSChunk => css`
    font: ${({ theme }) => (theme as AppTheme).typography.title[k].font};
    letter-spacing: ${({ theme }) => (theme as AppTheme).typography.title[k].letterSpacing};
  `,

  body: <K extends keyof AppTheme['typography']['body']>(k: K): CSSChunk => css`
    font: ${({ theme }) => (theme as AppTheme).typography.body[k].font};
    letter-spacing: ${({ theme }) => (theme as AppTheme).typography.body[k].letterSpacing};
  `,

  caption: <K extends keyof AppTheme['typography']['caption']>(k: K): CSSChunk => css`
    font: ${({ theme }) => (theme as AppTheme).typography.caption[k].font};
    letter-spacing: ${({ theme }) => (theme as AppTheme).typography.caption[k].letterSpacing};
  `,
} as const;
