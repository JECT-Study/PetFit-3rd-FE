import type { RemarkDto } from '@/types/calendar.dto';
import type { BriefItem } from './BriefCard';
import type { AlarmDto } from '@/types/alarm.dto';

export const mapAlarmsToBrief = (list: AlarmDto[]): BriefItem[] =>
  list.map(s => ({ id: s.alarmId, title: s.title }));

export const mapRemarksToBrief = (list: RemarkDto[]): BriefItem[] =>
  list.map(r => ({ id: r.remarkId, title: r.title }));
