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
