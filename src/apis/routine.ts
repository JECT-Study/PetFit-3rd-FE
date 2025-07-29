import { axiosInstance } from './axiosInstance';

export const checkRoutine = async (petId: number, date: string, category: string) => {
  try {
    const response = await axiosInstance.post(`routines/${petId}/${date}/${category}/check`);
    console.log(response);
  } catch (error) {
    console.log('check routine failed', error);
    throw error;
  }
};

export const unCheckedRoutine = async (petId: number, date: string, category: string) => {
  try {
    const response = await axiosInstance.post(`routines/${petId}/${date}/${category}/check`);
    console.log(response);
  } catch (error) {
    console.log('unchecked routine failed', error);
    throw error;
  }
};

export const getCheckedRoutine = async (petId: number, date: string) => {
  try {
    const response = await axiosInstance.get(`routines/${petId}/daily/${date}`);
    console.log('getcheckedroutine', response.data.content);
    return response.data.content;
  } catch (error) {
    console.log('get checked routine failed', error);
  }
};
