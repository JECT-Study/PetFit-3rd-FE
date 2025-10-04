import type { RemarkDto } from '@/types/calendar.dto';
import type { BriefItem } from './BriefCard';
import type { ScheduleItem } from '@/apis/home/schedules';

// 타입 수정 필요
export const mapSchedulesToBrief = (list: ScheduleItem[]): BriefItem[] =>
  list.map(s => ({ id: s.scheduleId, title: s.title }));

export const mapRemarksToBrief = (list: RemarkDto[]): BriefItem[] =>
  list.map(r => ({ id: r.remarkId, title: r.title }));
