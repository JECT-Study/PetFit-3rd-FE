import type { ApiResponse } from '@/types/common';

import { axiosInstance } from '../axiosInstance';
import type { RemarkDto } from '@/types/calendar.dto';

export const fetchHomeRemarks = async (petId: number): Promise<RemarkDto[]> => {
  try {
    const res = await axiosInstance.get<ApiResponse<RemarkDto[]>>(`/remarks/${petId}/home`);
    return res.data.content;
  } catch (error) {
    console.log('fetch home remarks failed', error);
    throw error;
  }
};
