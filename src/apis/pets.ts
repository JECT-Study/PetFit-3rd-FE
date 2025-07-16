import { axiosInstance } from './axiosInstance';

export const getPets = async () => {
  try {
    await axiosInstance.get('pets');
  } catch (error) {
    console.log('pets', error);
    throw error;
  }
};
