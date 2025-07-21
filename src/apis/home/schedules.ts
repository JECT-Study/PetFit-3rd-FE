import type { ApiResponse } from '@/types/common';

import { axiosInstance } from '../axiosInstance';

export interface ScheduleItem {
  scheduleId: number;
  title: string;
  content: string;
  targetDate: string;
}

export const fetchHomeSchedules = async (petId: number): Promise<ScheduleItem[]> => {
  const res = await axiosInstance.get<ApiResponse<ScheduleItem[]>>(`/schedules/${petId}/home`);
  return res.data.content;
};
