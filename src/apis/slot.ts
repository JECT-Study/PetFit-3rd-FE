import type { SlotType } from '@/types/slot';

import { axiosInstance } from './axiosInstance';

export const getSlot = async (petId: number): Promise<SlotType> => {
  try {
    const response = await axiosInstance.get(`slots/${petId}`);
    return response.data.content;
  } catch (error) {
    console.error('slot 조회 failed: ', error);
    throw error;
  }
};

export const initializeSlot = async (petId: number, data: SlotType) => {
  try {
    const response = await axiosInstance.post(`slots/${petId}`, data);
    console.log(response);
  } catch (error) {
    console.error('slot 수정 failed: ', error);
    throw error;
  }
};

export const patchSlot = async (petId: number, data: SlotType) => {
  try {
    const response = await axiosInstance.patch(`slots/${petId}`, data);
    console.log(response);
  } catch (error) {
    console.error('slot 수정 failed: ', error);
    throw error;
  }
};
