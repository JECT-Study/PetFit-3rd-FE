import type { ApiResponse } from '@/types/common';
import { axiosInstance } from '../axiosInstance';
import type { AlarmDto } from '@/types/alarm.dto';

export const fetchHomeAlarms = async (petId: number): Promise<AlarmDto[]> => {
  const res = await axiosInstance.get<ApiResponse<AlarmDto[]>>(`/alarms/${petId}/home`);
  return res.data.content;
};
