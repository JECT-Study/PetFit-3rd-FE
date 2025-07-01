import type { CalendarMarkType } from '@/types/calendar';
import type { PetType } from '@/types/common';

export const MOCK_PETS: { id: number; name: string; type: PetType }[] = [
  { id: 1, name: '댕댕이', type: '강아지' },
  { id: 2, name: '냥이', type: '고양이' },
  { id: 3, name: '콩이', type: '햄스터' },
];

export const MOCK_CALENDAR_MARKS: Record<string, CalendarMarkType[]> = {
  '2025-04-28': ['routine'],
  '2025-05-01': ['routine', 'memo'],
  '2025-05-04': ['note'],
  '2025-05-15': ['routine'],
  '2025-05-30': ['memo'],
  '2025-06-01': ['note'],
  '2025-06-04': ['routine', 'note'],
  '2025-06-08': ['memo'],
  '2025-06-15': ['routine', 'memo'],
  '2025-06-28': ['note'],
  '2025-06-29': ['note'],
  '2025-07-02': ['note'],
};
