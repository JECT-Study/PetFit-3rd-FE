import { useQuery } from '@tanstack/react-query';

import { getDailyRoutine } from '@/apis/routine';
import type { Routine } from '@/types/routine';
import { formatDate } from '@/utils/calendar';

export const useDailyRoutine = (petId: number) => {
  const today = formatDate(new Date());

  return useQuery<Routine[]>({
    queryKey: ['dailyRoutine', petId, today],
    queryFn: () => getDailyRoutine(petId, today),
  });
};
