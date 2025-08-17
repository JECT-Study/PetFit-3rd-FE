import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getSlot } from '@/apis/slot';
import type { SlotType } from '@/types/slot';

export const useSlot = (petId?: number) => {
  return useQuery<SlotType | null>({
    queryKey: ['slot', petId],
    enabled: !!petId,
    queryFn: async () => {
      try {
        const slot = await getSlot(petId as number);
        return slot;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
