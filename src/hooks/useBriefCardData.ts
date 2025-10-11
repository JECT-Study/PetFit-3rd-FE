import { useQuery } from '@tanstack/react-query';

import { fetchHomeRemarks, fetchHomeAlarms } from '@/apis/home';

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
