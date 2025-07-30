import type { ScheduleApiResponse, ScheduleFormData } from '@/apis/alarm';
import type { Alarm } from '@/types/alarm';
import { formatDate } from '@/utils/calendar'; // 너가 정의한 함수

// 🔄 Alarm → API 전송용 ScheduleFormData (등록/수정용 Body)
export const toScheduleFormData = (alarm: Alarm): ScheduleFormData => ({
  title: alarm.title,
  content: alarm.description,
  targetDate: formatDate(alarm.startDate), // 'YYYY-MM-DD' 형식으로 변환
});

// 🔄 Schedule(API 응답) → Alarm(UI에서 사용하는 객체)
export const toAlarm = (schedule: ScheduleApiResponse): Alarm => ({
  id: schedule.scheduleId,
  title: schedule.title,
  description: schedule.content,
  startDate: new Date(schedule.targetDate), // string → Date 객체로 복원
});
