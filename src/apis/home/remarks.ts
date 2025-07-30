import type { ApiResponse } from '@/types/common';

import { axiosInstance } from '../axiosInstance';

export interface RemarkItem {
  remarkId: number;
  title: string;
  content: string;
  remarkDate: string;
}

export const fetchHomeRemarks = async (petId: number): Promise<RemarkItem[]> => {
  const res = await axiosInstance.get<ApiResponse<RemarkItem[]>>(`/remarks/${petId}/home`);
  return res.data.content;
};
