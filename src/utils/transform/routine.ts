import type { Routine as APIRoutine } from '@/apis/calendar';
import type { RoutineStatus, SlotId, Routine as UiRoutine } from '@/types/routine';

export const toRoutineModel = (routine: APIRoutine): UiRoutine => {
  const statusMap: Record<APIRoutine['status'], RoutineStatus> = {
    CHECKED: 'CHECKED',
    MEMO: 'note',
    UNCHECKED: 'UNCHECKED',
  };

  return {
    id: routine.category as SlotId, // SLOT_ITEMS에서 유효한 값인지 보장 필요
    category: routine.category,
    status: statusMap[routine.status],
    targetAmount: routine.targetAmount ?? '',
    actualAmount: routine.actualAmount,
    content: routine.content,
    date: routine.date,
  };
};
