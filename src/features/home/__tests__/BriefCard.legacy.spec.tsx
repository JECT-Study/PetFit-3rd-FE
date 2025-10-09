// src/features/home/__tests__/BriefCard.legacy.spec.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { describe, expect, test, vi, type Mock } from 'vitest';

import { theme } from '@/styles/theme';

import { BriefCard } from '../BriefCard';

// useNavigate mock
vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: vi.fn() };
});

function renderWithDeps(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );
}

describe('[BriefCard][legacy] 알람 추가 버튼 → 라우팅', () => {
  test('+ 버튼 클릭 시 /alarm 으로 navigate 호출', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);

    renderWithDeps(<BriefCard variant="alarm" items={[]} />);

    await userEvent.click(screen.getByTestId('brief-add-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/alarm');
  });
});
