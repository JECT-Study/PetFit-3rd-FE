// src/features/home/__tests__/BriefCard.shared.spec.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { describe, expect, test } from 'vitest';

import { theme } from '@/styles/theme';

import { BriefCard } from '../BriefCard';

function renderWithDeps(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>
  );
}

const makeItems = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, title: `알람 ${i + 1}` }));

describe('[BriefCard][shared] 공통 행위', () => {
  test('리스트 렌더링: 2개 이하면 모두 보인다', () => {
    renderWithDeps(<BriefCard label="일정" color="#3b82f6" items={makeItems(2)} />);
    const items = screen.getAllByTestId('brief-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('알람 1');
    expect(items[1]).toHaveTextContent('알람 2');
  });

  test('토글(아코디언) 동작: 3개 이상이면 접힘 → 토글 클릭 시 모두 보임', async () => {
    renderWithDeps(<BriefCard label="일정" color="#3b82f6" items={makeItems(3)} />);

    // 초기: 2개만 노출
    expect(screen.getAllByTestId('brief-item')).toHaveLength(2);

    // 토글 클릭(data-testid 사용)
    await userEvent.click(screen.getByTestId('brief-toggle'));

    // 펼친 뒤: 3개 모두 노출
    const items = screen.getAllByTestId('brief-item');
    expect(items).toHaveLength(3);
    expect(items[2]).toHaveTextContent('알람 3');
  });

  test('로딩 메시지 표시', () => {
    renderWithDeps(<BriefCard label="일정" color="#3b82f6" items={[]} loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryAllByTestId('brief-item')).toHaveLength(0);
  });

  test('실패 메시지 표시', () => {
    renderWithDeps(<BriefCard label="일정" color="#3b82f6" items={[]} error="요청 실패" />);
    expect(screen.getByRole('alert')).toHaveTextContent('요청 실패');
    expect(screen.queryAllByTestId('brief-item')).toHaveLength(0);
  });
});
