import type { ApiResponse } from '@/types/common';

import { axiosInstance } from '../axiosInstance';

export interface ScheduleItem {
  scheduleId: number;
  title: string;
  content: string;
  targetDate: string;
}

export interface RemarkItem {
  remarkId: number;
  title: string;
  content: string;
  remarkDate: string;
}

export const fetchHomeSchedules = async (petId: number): Promise<ScheduleItem[]> => {
  const res = await axiosInstance.get<ApiResponse<ScheduleItem[]>>(`/schedules/${petId}/home`);
  return res.data.content;
};

export const fetchHomeRemarks = async (petId: number): Promise<RemarkItem[]> => {
  const res = await axiosInstance.get<ApiResponse<RemarkItem[]>>(`/remarks/${petId}/home`);
  return res.data.content;
};
