// types/calendar.ui.ts
// 화면에 직접 바인딩할 모델

import type { CALENDAR_LEGEND_ORDER } from '@/constants/calendar';
import type { NoteBase, NoteForm } from './calendar.base';

// 달력 마킹(표시 전용)
export type UiCalendarMarkType = (typeof CALENDAR_LEGEND_ORDER)[number];
export type UiCalendarMarksByDate = Record<string, UiCalendarMarkType[]>; // 'YYYY-MM-DD' -> ['completed','note']

// 프레젠테이션 모델
export interface UiNote extends NoteBase {
  id: number; // remarkId
}

/** UiNote에서 편집 가능한 필드만 */
export type EditableNote = NoteForm;
/** 편집 가능 필드 키 */
export type NoteField = keyof EditableNote; // 'title' | 'content'
