import { axiosInstance } from './axiosInstance';
import type { ApiResponse } from '../types/common';

// 응답 타입
export interface RemarkResponse {
  remarkId: number;
  title: string;
  content: string;
  remarkDate: string; // YYYY-MM-DD
}

// 등록/수정 요청 타입
export interface RemarkFormData {
  title: string;
  content: string;
  remarkDate: string; // YYYY-MM-DD
}

// 특이사항 등록
export const createRemark = async (
  petId: number,
  data: RemarkFormData
): Promise<RemarkResponse> => {
  const res = await axiosInstance.post<ApiResponse<RemarkResponse>>(`/remarks/${petId}`, data);
  return res.data.content;
};

// 특이사항 수정
export const updateRemark = async (
  remarkId: number,
  data: Omit<RemarkFormData, 'remarkDate'> // 수정에는 날짜 제외
): Promise<RemarkResponse> => {
  const res = await axiosInstance.patch<ApiResponse<RemarkResponse>>(`/remarks/${remarkId}`, data);
  return res.data.content;
};

// 특이사항 삭제
export const deleteRemark = async (remarkId: number): Promise<string> => {
  const res = await axiosInstance.delete<ApiResponse<string>>(`/remarks/${remarkId}`);
  return res.data.content;
};
