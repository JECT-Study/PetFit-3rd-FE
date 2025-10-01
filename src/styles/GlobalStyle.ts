import { createGlobalStyle } from 'styled-components';

import { tx } from './typography';

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.color.gray[50]};
    color: ${({ theme }) => theme.color.gray[700]};
    ${tx.body('reg14')};
  }
`;
