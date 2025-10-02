import { SLOT_ITEMS } from '@/constants/slot';

export type SlotId = (typeof SLOT_ITEMS)[number]['id'];
export type RoutineStatus = 'CHECKED' | 'MEMO' | 'UNCHECKED';

export interface Routine {
  id: SlotId;
  actualAmount?: number | null;
  category: string;
  targetAmount: number | string;
  content: string | null;
  status: RoutineStatus;
  date: string;
}

// 네이밍 통일 필요
export type RoutineStatusDto = 'CHECKED' | 'MEMO' | 'UNCHECKED';

export interface RoutineDto {
  routineId: number;
  category: string;
  status: RoutineStatusDto;
  targetAmount: number;
  actualAmount: number;
  content: string;
  date: string; // 'YYYY-MM-DD'
}

export interface UiRoutine {
  id: SlotId;
  actualAmount?: number | null;
  category: string;
  targetAmount: number | string;
  content: string | null;
  status: RoutineStatus;
  date: string;
}
