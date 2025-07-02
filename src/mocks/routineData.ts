import type { Routine } from '@/types/routine';

export const routineData: Routine[] = [
  {
    id: 'meal',
    current: 150,
    goal: 150,
    memo: '눈물자국 방지사료…',
    status: 'done',
  },
  {
    id: 'walk',
    current: 0,
    goal: 150,
    memo: '비와서 산책 안 감',
    status: 'note',
  },
  {
    id: 'water',
    current: 0,
    goal: 150,
    memo: '',
    status: 'todo',
  },
  {
    id: 'poop',
    current: null,
    goal: null,
    memo: '이상 없음',
    status: 'todo',
  },
];
