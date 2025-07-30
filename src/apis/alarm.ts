import { axiosInstance } from './axiosInstance'; // 환경에 맞게 경로 수정
import type { ApiResponse } from '../types/common'; // ApiResponse 정의가 있는 위치 기준

// API 응답 전용 타입
export interface ScheduleApiResponse {
  scheduleId: number;
  title: string;
  content: string;
  targetDate: string; // YYYY-MM-DD
}

// API 요청 바디 (등록/수정 시 사용)
export interface ScheduleFormData {
  title: string;
  content: string;
  targetDate?: string; // 등록 시 필요, 수정 시 선택
}

// 📌 일정 등록: POST /api/schedules/{petId}
export const createSchedule = async (
  petId: number,
  data: ScheduleFormData
): Promise<ScheduleApiResponse> => {
  const res = await axiosInstance.post<ApiResponse<ScheduleApiResponse>>(
    `/schedules/${petId}`,
    data
  );
  return res.data.content;
};

// 📌 일정 삭제: DELETE /api/schedules/{scheduleId}
export const deleteSchedule = async (scheduleId: number): Promise<string> => {
  const res = await axiosInstance.delete<ApiResponse<string>>(`/schedules/${scheduleId}`);
  return res.data.content;
};

// 📌 일정 수정: PATCH /api/schedules/{scheduleId}
export const updateSchedule = async (
  scheduleId: number,
  data: ScheduleFormData
): Promise<ScheduleApiResponse> => {
  const res = await axiosInstance.patch<ApiResponse<ScheduleApiResponse>>(
    `/schedules/${scheduleId}`,
    data
  );
  return res.data.content;
};

// 📌 전체 일정 조회: GET /api/schedules/{petId}/all
export const getAllSchedules = async (petId: number): Promise<ScheduleApiResponse[]> => {
  const res = await axiosInstance.get<ApiResponse<ScheduleApiResponse[]>>(
    `/schedules/${petId}/all`
  );
  return res.data.content;
};
