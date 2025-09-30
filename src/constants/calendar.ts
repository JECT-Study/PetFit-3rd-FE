import type { CalendarMarkType } from '@/types/calendar';

export const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'] as const;

// 순서를 보장하면서 구조적 데이터를 유지
export const LEGEND = [
  { key: 'completed', label: '루틴 완료', color: '#4285F4' },
  { key: 'memo', label: '메모', color: '#EA4335' },
  { key: 'note', label: '특이사항', color: '#FBBC05' },
] as const;

// 객체 접근이 필요한 경우: 맵 변환
export const LEGEND_MAP = LEGEND.reduce(
  (acc, item) => {
    acc[item.key] = { label: item.label, color: item.color };
    return acc;
  },
  {} as Record<CalendarMarkType, Omit<(typeof LEGEND)[number], 'key'>>
);
