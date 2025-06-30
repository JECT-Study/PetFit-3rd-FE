export const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const LEGEND_ITEMS = {
  routine: { label: '루틴 체크', color: '#4285F4' },
  memo: { label: '메모', color: '#EA4335' },
  note: { label: '특이사항', color: '#FBBC05' },
} as const;

export const LEGEND_ORDER = ['routine', 'memo', 'note'] as const;
