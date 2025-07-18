import type { LEGEND } from '@/constants/calendar';

export type CalendarMode = 'month' | 'week';

// 키 타입 추론
export type CalendarMarkType = (typeof LEGEND)[number]['key'];
