import type { RoutineDto, RoutineStatus, SlotId, Routine as UiRoutine } from '@/types/routine';

export const toUiRoutine = (routine: RoutineDto): UiRoutine => {
  const statusMap: Record<RoutineDto['status'], RoutineStatus> = {
    CHECKED: 'CHECKED',
    MEMO: 'MEMO',
    UNCHECKED: 'UNCHECKED',
  };

  return {
    id: routine.category as SlotId, // SLOT_ITEMS에서 유효한 값인지 보장 필요
    category: routine.category,
    status: statusMap[routine.status],
    targetAmount: routine.targetAmount,
    actualAmount: routine.actualAmount,
    content: routine.content,
    date: routine.date,
  };
};
