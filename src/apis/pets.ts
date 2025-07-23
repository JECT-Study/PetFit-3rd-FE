import { axiosInstance } from './axiosInstance';

export const getPets = async () => {
  try {
    const response = await axiosInstance.get('pets');
    return response.data.content;
  } catch (error) {
    console.log('pets', error);
    throw error;
  }
};
