import { useQuery } from '@tanstack/react-query';

import { fetchHomeRemarks } from '@/apis/home/remarks';
import { fetchHomeAlarms } from '@/apis/home/alarm';

export const useBriefCardData = (petId: number) => {
  const { data: alarmData = [] } = useQuery({
    queryKey: ['alarm', petId],
    queryFn: () => fetchHomeAlarms(petId),
  });
  const { data: remarkData = [] } = useQuery({
    queryKey: ['remark', petId],
    queryFn: () => fetchHomeRemarks(petId),
  });
  return { alarmData, remarkData };
};
