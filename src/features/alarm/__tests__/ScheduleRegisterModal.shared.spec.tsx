// src/features/alarm/__tests__/ScheduleRegisterModal.shared.spec.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { describe, expect, it, vi } from 'vitest';

import { theme } from '@/styles/theme';
import type { Alarm } from '@/types/alarm';

import { ScheduleRegisterModal } from '../ScheduleRegisterModal';

function renderModal(partial?: Partial<React.ComponentProps<typeof ScheduleRegisterModal>>) {
  const onClose = vi.fn();
  const onSubmit = vi.fn();
  const initialAlarm: Alarm = {
    id: 0,
    title: '',
    description: '',
    startDate: new Date('2025-09-13T00:00:00+09:00'),
  };
  const utils = render(
    <ThemeProvider theme={theme}>
      <ScheduleRegisterModal
        isOpen
        onClose={onClose}
        onSubmit={onSubmit}
        initialAlarm={initialAlarm}
        {...partial}
      />
    </ThemeProvider>
  );
  return { onClose, onSubmit, initialAlarm, ...utils };
}

describe('ScheduleRegisterModal [shared safety net]', () => {
  it('isOpen 토글 시 DOM이 마운트/언마운트 된다', () => {
    const init: Alarm = { id: 0, title: '', description: '', startDate: new Date('2025-09-13') };

    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <ScheduleRegisterModal isOpen onClose={() => {}} onSubmit={() => {}} initialAlarm={init} />
      </ThemeProvider>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <ScheduleRegisterModal
          isOpen={false}
          onClose={() => {}}
          onSubmit={() => {}}
          initialAlarm={init}
        />
      </ThemeProvider>
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('리오픈 시 initialAlarm으로 값이 리셋된다', async () => {
    const onClose = vi.fn();
    const init: Alarm = {
      id: 1,
      title: '초기 제목',
      description: '초기 내용',
      startDate: new Date('2025-09-13T00:00:00+09:00'),
    };

    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <ScheduleRegisterModal isOpen onClose={onClose} onSubmit={vi.fn()} initialAlarm={init} />
      </ThemeProvider>
    );

    const titleInput = screen.getByPlaceholderText(/제목.*입력/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, '수정 제목');

    // 닫았다가
    rerender(
      <ThemeProvider theme={theme}>
        <ScheduleRegisterModal
          isOpen={false}
          onClose={onClose}
          onSubmit={vi.fn()}
          initialAlarm={init}
        />
      </ThemeProvider>
    );
    // 다시 열면 초기값으로 복원
    rerender(
      <ThemeProvider theme={theme}>
        <ScheduleRegisterModal isOpen onClose={onClose} onSubmit={vi.fn()} initialAlarm={init} />
      </ThemeProvider>
    );
    expect(screen.getByDisplayValue('초기 제목')).toBeInTheDocument();
  });

  it('편집 오픈: 다른 initialAlarm으로 열면 해당 값으로 프리필된다', async () => {
    const onClose = vi.fn();

    const A: Alarm = {
      id: 10,
      title: 'A 제목',
      description: 'A 내용',
      startDate: new Date('2025-10-01T00:00:00+09:00'),
    };
    const B: Alarm = {
      id: 11,
      title: 'B 제목',
      description: 'B 내용',
      startDate: new Date('2025-10-05T00:00:00+09:00'),
    };

    // 1) A로 열기
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <ScheduleRegisterModal isOpen onClose={onClose} onSubmit={vi.fn()} initialAlarm={A} />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('제목')).toHaveValue('A 제목');
    expect(screen.getByLabelText('내용')).toHaveValue('A 내용');

    // 2) 닫았다가
    rerender(
      <ThemeProvider theme={theme}>
        <ScheduleRegisterModal
          isOpen={false}
          onClose={onClose}
          onSubmit={vi.fn()}
          initialAlarm={A}
        />
      </ThemeProvider>
    );

    // 3) B로 다시 열기 → 프리필이 B로 반영되어야 함
    rerender(
      <ThemeProvider theme={theme}>
        <ScheduleRegisterModal isOpen onClose={onClose} onSubmit={vi.fn()} initialAlarm={B} />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('제목')).toHaveValue('B 제목');
    expect(screen.getByLabelText('내용')).toHaveValue('B 내용');
  });

  it('무효 상태에서 [저장] 클릭해도 onSubmit이 호출되지 않는다', async () => {
    const { onSubmit } = renderModal();
    const save = screen.getByRole('button', { name: /저장/i });
    expect(save).toBeDisabled();
    await userEvent.click(save);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('X 버튼 클릭 시 onClose가 호출된다', async () => {
    const { onClose } = renderModal();
    const closeBtn = screen.getByRole('button', { name: /닫기/i });
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
