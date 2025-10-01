import type { CalendarMarkType, CalendarMarksByDate, MonthlyEntryDto } from '@/types/calendar';

// 월간 DTO -> UI 마킹 (scheduled 제외)
export function toCalendarMarks(entries: MonthlyEntryDto[]): CalendarMarksByDate {
  if (!entries?.length) return {};
  const acc: CalendarMarksByDate = {};
  for (const e of entries) {
    const types: CalendarMarkType[] = [];
    if (e.completed) types.push('completed');
    if (e.memo) types.push('memo');
    if (e.remarked) types.push('note');
    if (types.length) acc[e.entryDate] = types;
  }
  return acc;
}
