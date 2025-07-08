import { SLOT_ITEMS } from '@/constants/slot';

export type SlotId = (typeof SLOT_ITEMS)[number]['id'];
export type RoutineStatus = 'done' | 'note' | 'todo';

export interface Routine {
  id: SlotId;
  current?: number | null;
  default: number | string;
  memo: string | null;
  status: RoutineStatus;
}
