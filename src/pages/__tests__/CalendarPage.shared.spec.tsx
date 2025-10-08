// src/pages/__tests__/CalendarPage.shared.behavior.spec.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSelector, useDispatch } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import { theme } from '@/styles/theme';

import { CalendarPage } from '../CalendarPage';

/* 1) react-redux 목킹: selector는 고정 fakeState를 평가 */
vi.mock('react-redux', async orig => {
  const real = await orig<typeof import('react-redux')>();
  return {
    ...real,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

/* 2) API 모듈 목킹 */
vi.mock('@/apis/calendar', () => {
  const fetchMonthlyEntries = vi.fn(async () => [
    // 2025-09-13에만 마크 2개(completed/memo) 표시
    { entryDate: '2025-09-13', completed: true, memo: true, remarked: false },
  ]);

  const fetchDailyEntries = vi.fn(async (_petId: number, date: string) =>
    date === '2025-09-13'
      ? {
          routineResponseList: [
            {
              routineId: 1,
              category: 'feed',
              status: 'CHECKED',
              targetAmount: 150,
              actualAmount: 150,
              content: '오늘도 잘 먹었어요!',
              date: '2025-09-13',
            },
          ],
          remarkResponseList: [
            {
              remarkId: 1,
              title: '구토',
              content: '아침에 구토를 2회 했음',
              remarkDate: '2025-09-13',
            },
          ],
        }
      : {
          routineResponseList: [],
          remarkResponseList: [],
        }
  );

  return { fetchMonthlyEntries, fetchDailyEntries };
});

/* 3) 공용 렌더러: Provider 없이 QueryClient/Theme/Router만 */
function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <CalendarPage />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/* 4) base fake state + 테스트별로 모드만 덮어쓰기 위한 헬퍼 */
const baseState = {
  calendar: {
    mode: 'month',
    viewDate: new Date('2025-09-01T00:00:00+09:00'),
    selectedDate: new Date('2025-09-13T00:00:00+09:00'),
  },
  selectedPet: { id: 1 },
  user: { memberId: 99 },
};

function bindSelectorTo(state: typeof baseState) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (useSelector as unknown as Mock).mockImplementation((selector: any) => selector(state));
  (useDispatch as unknown as Mock).mockReturnValue(vi.fn());
}

beforeEach(() => {
  vi.clearAllMocks();
  bindSelectorTo(baseState); // 기본은 month 모드
});

/* 날짜셀 접근 헬퍼(셀에 button role이 없으면 텍스트로 접근) */
const getDayCell = (dayText: string) => {
  // MonthView가 날짜 숫자를 그대로 텍스트로 렌더하므로 가장 가까운 셀 div 탐색
  const el = screen.getByText(dayText);
  return el.closest('div') ?? el.parentElement ?? el;
};

describe('[CalendarPage][shared behavior – Provider 없이]', () => {
  it('① 달력 점이 렌더링된다(2025-09-13)', async () => {
    renderPage();

    const cell = getDayCell('13');
    await waitFor(() => {
      // MonthView의 Dot에 data-testid="dot-..." 추가되어 있다고 가정
      const dots = within(cell!).getAllByTestId(/dot-/i);
      expect(dots.length).toBeGreaterThan(0);
    });
  });

  it('② 선택된 날짜(초기값 2025-09-13)의 루틴 목록이 보인다(week 모드)', async () => {
    // 주간 뷰에서 하루 루틴 블록이 렌더된다는 가정 → 모드만 week로 덮어쓰기
    bindSelectorTo({
      ...baseState,
      calendar: { ...baseState.calendar, mode: 'week' },
    });

    renderPage();
    expect(await screen.findByText(/오늘도 잘 먹었어요!/)).toBeInTheDocument();
  });

  it('③ 「특이사항 추가」 클릭 시 모달이 열린다(week 모드, 닫기까지 확인)', async () => {
    // 특이사항 버튼은 주간 뷰에 있다고 가정 → 모드만 week로 덮어쓰기
    bindSelectorTo({
      ...baseState,
      calendar: { ...baseState.calendar, mode: 'week' },
    });

    renderPage();

    await userEvent.click(screen.getByRole('button', { name: /특이사항\s*추가/i }));

    // 모달 열림 확인(가능하면 role="dialog" 보장)
    const dlg = await screen.findByRole('dialog');
    expect(dlg).toBeInTheDocument();

    // 필수 컨트롤 존재
    expect(within(dlg).getByRole('button', { name: /저장/i })).toBeInTheDocument();

    // 닫기 (닫기/취소 버튼 또는 라벨이 있는 닫기 아이콘)
    await userEvent.click(within(dlg).getByRole('button', { name: /닫기/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});
