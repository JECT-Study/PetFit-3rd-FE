// src/features/alarm/__tests__/ScheduleRegisterModal.new.spec.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect } from 'vitest';

import { theme } from '@/styles/theme';
import type { Alarm } from '@/types/alarm';

import { ScheduleRegisterModal } from '../ScheduleRegisterModal';

function renderModal() {
  const initialAlarm: Alarm = {
    id: 0,
    title: '',
    description: '',
    startDate: new Date('2025-10-28T00:00:00+09:00'),
    // 시간이 initialAlarm에 들어간다면, 구현 후 여기에 필드 추가
  };

  return render(
    <ThemeProvider theme={theme}>
      <ScheduleRegisterModal
        isOpen
        onClose={() => {}}
        onSubmit={() => {}}
        initialAlarm={initialAlarm}
      />
    </ThemeProvider>
  );
}

describe('ScheduleRegisterModal [new] 시간 필드 (미구현 → skip)', () => {
  it.skip('모달에 "시간" 입력 UI가 노출된다(라벨/role 기반)', () => {
    renderModal();
    // 구현 후: 가장 견고한 라벨/role 셀렉터로 검증
    // 예) getByLabelText(/시간/i) 또는 select/combobox 역할로 탐색
    // expect(screen.getByLabelText(/시간/i)).toBeInTheDocument();
    // 또는: expect(screen.getByRole('combobox', { name: /시간/i })).toBeInTheDocument();

    // 현재는 미구현이므로 skip 상태 유지
  });

  it.skip('시간이 비어 있으면 [저장] 비활성화, 시간 선택 시 활성화', async () => {
    renderModal();

    // 제목/내용은 유효값으로 채워두고, "시간"만으로 enable/disable를 검증
    await userEvent.type(screen.getByLabelText('제목'), '건강검진');
    await userEvent.type(screen.getByLabelText('내용'), '병원 예약');

    const save = screen.getByRole('button', { name: /저장/i });
    expect(save).toBeDisabled(); // 시간 미선택 가정 (구현 후 유지)

    // 시간 선택(구현 후 실제 UI에 맞춰 조정)
    // 1) select: await userEvent.selectOptions(screen.getByLabelText(/시간/i), '08:00');
    // 2) combobox: await userEvent.click(screen.getByRole('combobox', { name: /시간/i })); ...
    // 3) input: await userEvent.type(screen.getByLabelText(/시간/i), '08:00');

    // expect(save).toBeEnabled();
  });

  it.skip('기본 시간 값이 있으면 해당 값이 표시된다(예: 오전 08:00)', () => {
    renderModal();
    // 구현 후 실제 기본값 셀렉터/표기 규칙에 맞춰 수정
    // 예) expect(screen.getByDisplayValue(/오전\s?0?8:00/i)).toBeInTheDocument();
  });
});
