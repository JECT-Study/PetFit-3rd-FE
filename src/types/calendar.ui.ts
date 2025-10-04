import type { CALENDAR_LEGEND_ORDER } from '@/constants/calendar';

// UI 모델(예: 날짜별 마킹)
export type UiCalendarMarkType = (typeof CALENDAR_LEGEND_ORDER)[number];
export type UiCalendarMarksByDate = Record<string, UiCalendarMarkType[]>; // 'YYYY-MM-DD' -> ['completed','note']

export interface UiNote {
  id: number; // remarkId
  title: string;
  content: string;
}

/** UiNote에서 편집 가능한 필드만 추출 */
export type EditableNote = Omit<UiNote, 'id'>;
/** 편집 가능한 필드 키 */
export type NoteField = keyof EditableNote; // 'title' | 'content'
