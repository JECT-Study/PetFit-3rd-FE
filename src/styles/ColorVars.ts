// src/styles/ColorVars.tsx
import { createGlobalStyle } from 'styled-components';

import type { AppTheme } from '@/styles/theme';

const buildColorVars = (t: AppTheme) => {
  const lines: string[] = [];
  (Object.keys(t.colors) as Array<keyof AppTheme['colors']>).forEach(group => {
    (Object.keys(t.colors[group]) as Array<keyof AppTheme['colors'][typeof group]>).forEach(
      shade => {
        lines.push(`--${String(group)}-${String(shade)}: ${t.colors[group][shade]};`);
      }
    );
  });
  return lines.join('\n');
};

export const ColorVars = createGlobalStyle`
  :root {
    ${({ theme }) => buildColorVars(theme as AppTheme)}
  }
`;
