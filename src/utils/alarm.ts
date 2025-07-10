import type { Alarm } from '@/types/alarm';

export const isEditing = (list: Alarm[], target: Alarm) => list.some(a => a.id === target.id);

export const addOrUpdateAlarmList = (list: Alarm[], target: Alarm): Alarm[] => {
  return isEditing(list, target)
    ? list.map(alarm => (alarm.id === target.id ? target : alarm))
    : [...list, target];
};
