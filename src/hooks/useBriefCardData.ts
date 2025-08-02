import { useQuery } from '@tanstack/react-query';

import { fetchHomeRemarks } from '@/apis/home/remarks';
import { fetchHomeSchedules } from '@/apis/home/schedules';

export const useBriefCardData = (petId: number) => {
  const { data: scheduleData = [] } = useQuery({
    queryKey: ['schedule', petId],
    queryFn: () => fetchHomeSchedules(petId),
  });
  const { data: remarkData = [] } = useQuery({
    queryKey: ['remark', petId],
    queryFn: () => fetchHomeRemarks(petId),
  });
  return { scheduleData, remarkData };
};
