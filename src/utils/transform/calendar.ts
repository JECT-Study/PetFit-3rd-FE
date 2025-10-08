import { CALENDAR_LEGEND_ORDER } from '@/constants/calendar';
import type {
  MonthlyEntryDto,
  RemarkCreateDto,
  RemarkDto,
  RemarkUpdateDto,
} from '@/types/calendar.dto';
import type { UiCalendarMarksByDate, UiCalendarMarkType, UiNote } from '@/types/calendar.ui';
import { formatDate } from '../calendar';

// 월간 DTO -> UI 마킹 (scheduled 제외)
export function toUiCalendarMarks(entries: MonthlyEntryDto[]): UiCalendarMarksByDate {
  if (!entries?.length) return {};
  const marks: UiCalendarMarksByDate = {};

  for (const e of entries) {
    const flags: Record<UiCalendarMarkType, boolean> = {
      completed: e.completed,
      memo: e.memo,
      note: e.remarked,
    };
    const types = (CALENDAR_LEGEND_ORDER as readonly UiCalendarMarkType[]).filter(k => flags[k]);

    if (types.length) {
      marks[e.entryDate] = types;
    }
  }
  return marks;
}

export const toUiNote = ({ remarkId: id, title, content }: RemarkDto): UiNote => {
  return { id, title, content };
};
export const toRemarkCreateDto = (note: UiNote, date: Date): RemarkCreateDto => {
  return {
    title: note.title,
    content: note.content,
    remarkDate: formatDate(date), // 'YYYY-MM-DD'
  };
};
export const toRemarkUpdateDto = ({ title, content }: UiNote): RemarkUpdateDto => {
  return { title, content };
};
