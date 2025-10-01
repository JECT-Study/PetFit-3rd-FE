import type { CALENDAR_LEGEND_ORDER } from '@/constants/calendar';

// UI 모델(예: 날짜별 마킹)
export type CalendarMarkType = (typeof CALENDAR_LEGEND_ORDER)[number];
export type CalendarMarksByDate = Record<string, CalendarMarkType[]>; // 'YYYY-MM-DD' -> ['completed','note']

// 월간 엔트리 DTO (백엔드 응답 그대로)
export interface MonthlyEntryDto {
  entryDate: string; // 'YYYY-MM-DD'
  completed: boolean; // 루틴 완료 여부
  memo: boolean; // 메모 존재 여부
  remarked: boolean; // 특이사항 존재 여부
  scheduled: boolean; // UI에선 제외(요구사항 외)
}
// 일간 상세 조회 DTO
export interface DailyEntryResponseDto {
  entryDate: string; // 'YYYY-MM-DD'
  remarkResponseList: RemarkDto[];
  routineResponseList: RoutineDto[];
}
export interface RemarkDto {
  remarkId: number;
  title: string;
  content: string;
  remarkDate: string; // 'YYYY-MM-DD'
}
export interface RoutineDto {
  routineId: number;
  category: string;
  status: 'CHECKED' | 'MEMO' | 'UNCHECKED';
  targetAmount: number;
  actualAmount: number;
  content: string;
  date: string; // 'YYYY-MM-DD'
}
