import { axiosInstance } from './axiosInstance';
import type { ApiResponse } from '../types/common';
import type { DailyEntryResponseDto, MonthlyEntryDto } from '@/types/calendar';

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
): Promise<DailyEntryResponseDto> => {
  const res = await axiosInstance.get<ApiResponse<DailyEntryResponseDto>>(
    `/entries/${petId}/daily/${date}`
  );
  return res.data.content;
};
