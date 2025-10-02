import type { RoutineDto } from './routine';

// 월간 엔트리 DTO (백엔드 응답 그대로)
export interface MonthlyEntryDto {
  entryDate: string; // 'YYYY-MM-DD'
  completed: boolean; // 루틴 완료 여부
  memo: boolean; // 메모 존재 여부
  remarked: boolean; // 특이사항 존재 여부
  scheduled: boolean; // UI에선 제외(요구사항 외)
}
// 일간 상세 조회 DTO
export interface DailyEntryDto {
  entryDate: string; // 'YYYY-MM-DD'
  remarkResponseList: RemarkDto[];
  routineResponseList: RoutineDto[];
}

// 특이사항 조회 DTO
export interface RemarkDto {
  remarkId: number;
  title: string;
  content: string;
  remarkDate: string; // 'YYYY-MM-DD'
}

// 등록/수정 요청 바디(DTO)
export interface RemarkCreateDto {
  title: string;
  content: string;
  remarkDate: string; // 'YYYY-MM-DD'
}
export type RemarkUpdateDto = Pick<RemarkCreateDto, 'title' | 'content'>; // PATCH는 날짜 제외
