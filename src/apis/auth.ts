import { axiosInstance } from './axiosInstance';

export const editNickname = async (memberId: number, nickname: string) => {
  try {
    const response = await axiosInstance.put(`members/${memberId}`, { nickname });
    console.log(response);
  } catch (error) {
    console.error('edit nickname failed: ', error);
    throw error;
  }
};
