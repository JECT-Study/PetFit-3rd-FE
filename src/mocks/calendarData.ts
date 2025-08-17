import type { CalendarMarkType } from '@/types/calendar';
import type { PetType } from '@/types/form';
import type { Note } from '@/types/note';

export const MOCK_PETS: { id: number; name: string; type: PetType }[] = [
  { id: 1, name: '댕댕이', type: '강아지' },
  { id: 2, name: '냥이', type: '고양이' },
  { id: 3, name: '콩이', type: '햄스터' },
];

export const MOCK_CALENDAR_MARKS: Record<string, CalendarMarkType[]> = {
  '2025-04-28': ['completed'],
  '2025-05-01': ['completed', 'memo'],
  '2025-05-04': ['note'],
  '2025-05-15': ['completed'],
  '2025-05-30': ['memo'],
  '2025-06-01': ['note'],
  '2025-06-04': ['completed', 'note'],
  '2025-06-08': ['memo'],
  '2025-06-15': ['completed', 'memo'],
  '2025-06-28': ['note'],
  '2025-06-29': ['note'],
  '2025-07-02': ['note'],
} satisfies Record<string, CalendarMarkType[]>;

export const MOCK_CALENDAR_NOTES: Note[] = [
  {
    id: 1,
    title: '댕댕이 구토',
    content: '댕댕이가 오늘 열이 나고 토를 지속적으로 해서 당일 특이사항으로 기록',
  },
  {
    id: 2,
    title: '물 마신 양이 적음',
    content: '평소보다 물을 적게 마셔서 주의 필요. 식욕은 정상',
  },
  {
    id: 3,
    title: '산책 중 발을 절음',
    content: '저녁 산책 중 왼쪽 뒷다리를 약간 절었음. 내일 병원 방문 예정',
  },
  {
    id: 4,
    title: '밥을 남김',
    content: '저녁 사료의 반을 남기고 식사를 멈춤. 컨디션은 평소와 동일',
  },
];
