import { axiosInstance } from './axiosInstance';

export const createReport = async (petId: number, startDate: string, endDate: string) => {
  const payload = {
    petId,
    startDate,
    endDate,
  };
  try {
    const response = await axiosInstance.post('aireports/generate', payload);
    return response.data.content;
  } catch (error) {
    console.log('ai 보고서 생성 실패');
  }
};

export const getReport = async (reportId: number) => {
  try {
    const response = await axiosInstance.get(`aireports/${reportId}`);
    return response.data.content;
  } catch {
    console.log('ai 보고서 불러오기 실패');
  }
};

export const deleteReport = async (reportId: number) => {
  try {
    await axiosInstance.delete(`aireports/${reportId}`);
  } catch {
    console.log('ai 보고서 삭제 실패');
  }
};

export const getReportList = async (petId: number) => {
  try {
    const response = await axiosInstance.get('aireports/list', { params: { petId } });
    return response.data.content;
  } catch {
    console.log('ai 보고서 목록 불러오기 실패');
  }
};
