// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath, URL } from 'node:url';
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)', '../src/**/*.mdx'], // ✅ 스토리 글롭
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (config) => {
    // alias 합치기
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    };
    // SVGR 플러그인 주입 (스토리 내 SVG React 변환 필요 시)
    config.plugins = [...(config.plugins || []), svgr()];
    return config;
  },
} satisfies StorybookConfig;
export default config;
