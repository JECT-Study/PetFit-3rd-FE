// src/setupTests.ts
import '@testing-library/jest-dom/vitest';

// fetch 폴리필 (node 환경)
import 'whatwg-fetch';
import { afterAll, afterEach, beforeAll } from 'vitest';

// ✅ Vitest(Node)에서는 msw/node만 사용
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
