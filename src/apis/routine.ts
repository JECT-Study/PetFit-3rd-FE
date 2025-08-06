import { axiosInstance } from './axiosInstance';

export const getDailyRoutine = async (petId: number, date: string) => {
  try {
    const response = await axiosInstance.get(`routines/${petId}/daily/${date}`);
    return response.data.content;
  } catch (error) {
    console.log('get daily routine failed', error);
    throw error;
  }
};

export const checkRoutine = async (petId: number, date: string, category: string) => {
  try {
    const response = await axiosInstance.post(`routines/${petId}/${date}/${category}/check`);
    console.log(response);
  } catch (error) {
    console.log('check routine failed', error);
    throw error;
  }
};

export const uncheckRoutine = async (petId: number, date: string, category: string) => {
  try {
    const response = await axiosInstance.delete(`routines/${petId}/${date}/${category}/uncheck`);
    console.log(response);
  } catch (error) {
    console.log('unchecked routine failed', error);
    throw error;
  }
};
