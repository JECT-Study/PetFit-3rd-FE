import type { Routine } from '@/types/routine';

export const routineData: Routine[] = [
  {
    id: 'meal',
    current: 150,
    default: 150,
    memo: '눈물자국 방지사료 눈물자국 방지사료 눈물자국 방지사료 눈물자국 방지사료 눈물자국 방지사료',
    status: 'done',
  },
  {
    id: 'walk',
    current: 0,
    default: 150,
    memo: '비와서 산책 안 감',
    status: 'note',
  },
  {
    id: 'water',
    current: 0,
    default: 150,
    memo: null,
    status: 'todo',
  },
  { id: 'poop', default: '이상 없음', memo: null, status: 'todo' },
  { id: 'teeth', default: '이상 없음', memo: null, status: 'todo' },
  { id: 'skin', default: '이상 없음', memo: null, status: 'todo' },
];
