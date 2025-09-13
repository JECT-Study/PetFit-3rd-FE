// src/mocks/server.ts
import { setupServer } from 'msw/node';

import { handlers } from './handlers';

// Vitest(Node 환경)에서만 동작하는 mock 서버
export const server = setupServer(...handlers);
