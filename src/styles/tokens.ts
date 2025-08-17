// src/styles/tokens.ts
import { css, type DefaultTheme } from 'styled-components';

import type { AppTheme } from '@/styles/theme';
import { theme } from '@/styles/theme';

/* ───────────── Typography mixins ───────────── */
type TypoKey = keyof AppTheme['typography'];

export const typo = Object.fromEntries(
  (Object.keys(theme.typography) as TypoKey[]).map(k => [
    k,
    ({ theme }: { theme: DefaultTheme }) => css`
      font-size: ${theme.typography[k].fontSize};
      line-height: ${theme.typography[k].lineHeight};
      font-weight: ${theme.typography[k].fontWeight};
      letter-spacing: ${theme.typography[k].letterSpacing};
    `,
  ])
) as Record<TypoKey, ({ theme }: { theme: DefaultTheme }) => ReturnType<typeof css>>;

/* ───────────── Color getters (tone) ───────────── */
type ColorGroups = AppTheme['colors'];
type GroupKey = keyof ColorGroups;
type ShadeKeys<G extends GroupKey> = keyof ColorGroups[G] & (string | number);

/** 최종 키: 'white0' | 'grey700' | 'main500' … */
export type ColorKey = {
  [G in GroupKey]: `${Extract<G, string>}${Extract<ShadeKeys<G>, string>}`;
}[GroupKey];

/** 색 값을 string으로 안전하게 좁히는 보조 함수 */
function pickColor<G extends GroupKey, S extends ShadeKeys<G>>(
  t: DefaultTheme,
  g: G,
  s: S
): string {
  // AppTheme 상 색상 값은 문자열 리터럴이므로 string으로 안전 단언
  return t.colors[g][s] as string;
}

type ColorGetter = (theme: DefaultTheme) => string;

const toneEntries: Array<[ColorKey, ColorGetter]> = [];

(Object.keys(theme.colors) as GroupKey[]).forEach(<G extends GroupKey>(group: G) => {
  (Object.keys(theme.colors[group]) as ShadeKeys<G>[]).forEach(
    <S extends ShadeKeys<G>>(shade: S) => {
      const key = `${String(group)}${String(shade)}` as ColorKey;
      toneEntries.push([key, t => pickColor(t, group, shade)]);
    }
  );
});

export const tone = Object.fromEntries(toneEntries) as Record<ColorKey, ColorGetter>;
