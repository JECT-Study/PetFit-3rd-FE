import type { ApiResponse } from '@/types/common';
import { axiosInstance } from './axiosInstance';
import type { AlarmDto } from '@/types/alarm.dto';
import type { RemarkDto } from '@/types/calendar.dto';

export const fetchHomeAlarms = async (petId: number): Promise<AlarmDto[]> => {
  const res = await axiosInstance.get<ApiResponse<AlarmDto[]>>(`/alarms/${petId}/home`);
  return res.data.content;
};

export const fetchHomeRemarks = async (petId: number): Promise<RemarkDto[]> => {
  try {
    const res = await axiosInstance.get<ApiResponse<RemarkDto[]>>(`/remarks/${petId}/home`);
    return res.data.content;
  } catch (error) {
    console.log('fetch home remarks failed', error);
    throw error;
  }
};
