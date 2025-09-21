// .storybook/preview.tsx
import type { Preview, Decorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { GlobalStyle } from '../src/styles/GlobalStyle';
import { theme } from '../src/styles/theme';

const withProviders: Decorator = (Story, context) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <MemoryRouter>
      <Story {...context} />
    </MemoryRouter>
  </ThemeProvider>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
  },
};

export default preview;
