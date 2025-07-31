import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { getDailyRoutine } from '@/apis/routine';
import type { Routine } from '@/types/routine';

export const useDailyRoutine = (petId: number) => {
  const today = dayjs().format('YYYY-MM-DD');

  return useQuery<Routine[]>({
    queryKey: ['dailyRoutine', petId, today],
    queryFn: () => getDailyRoutine(petId, today),
  });
};
