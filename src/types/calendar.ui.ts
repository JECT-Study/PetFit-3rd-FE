import type { CALENDAR_LEGEND_ORDER } from '@/constants/calendar';

// UI 모델(예: 날짜별 마킹)
export type UiCalendarMarkType = (typeof CALENDAR_LEGEND_ORDER)[number];
export type UiCalendarMarksByDate = Record<string, UiCalendarMarkType[]>; // 'YYYY-MM-DD' -> ['completed','note']

export interface UiNote {
  id: number; // remarkId
  title: string;
  content: string;
}
