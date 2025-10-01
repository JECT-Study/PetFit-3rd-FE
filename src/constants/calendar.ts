export const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'] as const;

// 표시 순서만 별도 보관
export const CALENDAR_LEGEND_ORDER = ['completed', 'memo', 'note'] as const;

// 단일 소스(맵): label + color(CSS var)
export const CALENDAR_LEGEND = {
  completed: { label: '루틴 완료', color: 'var(--sub-500)' },
  memo: { label: '메모', color: 'var(--warning-500)' },
  note: { label: '특이사항', color: 'var(--main-600)' },
} as const;
