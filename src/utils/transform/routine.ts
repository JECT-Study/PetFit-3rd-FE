import { SLOT_IDS, type RoutineDto, type RoutineSlotKey, type UiRoutine } from '@/types/routine';

// 백엔드 DTO가 enum이 아닌 관계로 런타임 검증
const SLOT_ID_SET = new Set<RoutineSlotKey>(SLOT_IDS);
export const toSlotKey = (v: string): RoutineSlotKey => {
  if (SLOT_ID_SET.has(v as RoutineSlotKey)) return v as RoutineSlotKey;
  throw new Error(`Invalid slotKey: ${v}`);
};

export const toUiRoutine = ({
  routineId: id,
  category,
  status,
  targetAmount,
  actualAmount,
  content,
  date,
}: RoutineDto): UiRoutine => {
  return {
    id,
    slotKey: toSlotKey(category),
    status,
    targetAmount,
    actualAmount,
    content,
    date,
  };
};
