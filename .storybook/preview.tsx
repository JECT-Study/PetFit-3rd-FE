// .storybook/preview.tsx
import type { Preview, Decorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { GlobalStyle } from '../src/styles/GlobalStyle';
import { theme } from '../src/styles/theme';
import { ToastProvider } from '../src/ds/ToastProvider';
import '../src/styles/color-vars.declare.css';

const withProviders: Decorator = (Story, context) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <MemoryRouter>
      <ToastProvider>
        <Story {...context} />
      </ToastProvider>
    </MemoryRouter>
  </ThemeProvider>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
    docs: { story: { inline: false }, canvas: { layout: 'fullscreen' } },
    layout: 'fullscreen',
  },
};

export default preview;
