import type { SlotType } from '@/types/slot';

import { axiosInstance } from './axiosInstance';

export const getSlot = async (petId: number): Promise<SlotType> => {
  try {
    const response = await axiosInstance.get(`slots/${petId}`);
    console.log(response.data.content);
    return response.data.content;
  } catch (error) {
    console.error('slot 조회 failed: ', error);
    throw error;
  }
};
