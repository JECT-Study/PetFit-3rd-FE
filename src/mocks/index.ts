export async function initMocks() {
  if (typeof window === 'undefined') {
    // Node 환경 (Vitest, CI)
    const { server } = await import('./server');
    server.listen({ onUnhandledRequest: 'warn' });
  } else {
    // 브라우저 환경 (Vite dev server)
    const { worker } = await import('./browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}
