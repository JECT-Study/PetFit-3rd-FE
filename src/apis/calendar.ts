import { axiosInstance } from './axiosInstance';
import type { ApiResponse } from '../types/common';

// 📌 월간 유무 조회 API 응답
export interface MonthlyEntry {
  entryDate: string; // YYYY-MM-DD
  completed: boolean; // 루틴 완료 여부
  memo: boolean; // 메모 존재 여부
  remarked: boolean; // 특이사항 존재 여부
  scheduled: boolean; // 일정 존재 여부
}

// 📌 일간 상세 조회 API 응답
export interface DailyEntryResponse {
  entryDate: string; // YYYY-MM-DD
  remarkResponseList: Remark[];
  routineResponseList: Routine[];
}

export interface Remark {
  remarkId: number;
  title: string;
  content: string;
  remarkDate: string; // YYYY-MM-DD
}

export interface Routine {
  routineId: number;
  category: string;
  status: 'CHECKED' | 'MEMO' | 'UNCHECKED'; // 상태값 제한
  targetAmount: number;
  actualAmount: number;
  content: string;
  date: string; // YYYY-MM-DD
}

// 📍 월간 루틴/메모/특이사항/일정 유무 조회
export const fetchMonthlyEntries = async (
  petId: number,
  month: string // 'yyyy-MM' 형식
): Promise<MonthlyEntry[]> => {
  const res = await axiosInstance.get<ApiResponse<MonthlyEntry[]>>(
    `/entries/${petId}/monthly/${month}`
  );
  return res.data.content;
};

// 📍 일간 특이사항 + 루틴 상세 조회
export const fetchDailyEntries = async (
  petId: number,
  date: string // 'yyyy-MM-dd' 형식
): Promise<DailyEntryResponse> => {
  const res = await axiosInstance.get<ApiResponse<DailyEntryResponse>>(
    `/entries/${petId}/daily/${date}`
  );
  return res.data.content;
};
