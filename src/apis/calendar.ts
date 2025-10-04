import { axiosInstance } from './axiosInstance';
import type { ApiResponse } from '../types/common';
import type { DailyEntryDto, MonthlyEntryDto } from '@/types/calendar.dto';
import type { RemarkCreateDto, RemarkDto, RemarkUpdateDto } from '@/types/calendar.dto';

// 📍 월간 루틴/메모/특이사항/일정 유무 조회
export const fetchMonthlyEntries = async (
  petId: number,
  month: string // 'yyyy-MM' 형식
): Promise<MonthlyEntryDto[]> => {
  const res = await axiosInstance.get<ApiResponse<MonthlyEntryDto[]>>(
    `/entries/${petId}/monthly/${month}`
  );
  return res.data.content;
};

// 📍 일간 특이사항 + 루틴 상세 조회
export const fetchDailyEntries = async (
  petId: number,
  date: string // 'yyyy-MM-dd' 형식
): Promise<DailyEntryDto> => {
  const res = await axiosInstance.get<ApiResponse<DailyEntryDto>>(
    `/entries/${petId}/daily/${date}`
  );
  return res.data.content;
};

// 특이사항 등록
export const createNote = async (petId: number, data: RemarkCreateDto): Promise<RemarkDto> => {
  const res = await axiosInstance.post<ApiResponse<RemarkDto>>(`/remarks/${petId}`, data);
  return res.data.content;
};
// 특이사항 수정
export const updateNote = async (remarkId: number, data: RemarkUpdateDto): Promise<RemarkDto> => {
  const res = await axiosInstance.patch<ApiResponse<RemarkDto>>(`/remarks/${remarkId}`, data);
  return res.data.content;
};
// 특이사항 삭제
export const deleteNote = async (remarkId: number): Promise<string> => {
  const res = await axiosInstance.delete<ApiResponse<string>>(`/remarks/${remarkId}`);
  return res.data.content;
};
