// hooks/useBriefCardData.ts
import { useEffect, useState } from 'react';

import { fetchHomeRemarks } from '@/apis/home/remarks';
import type { RemarkItem } from '@/apis/home/remarks';
import { fetchHomeSchedules } from '@/apis/home/schedules';
import type { ScheduleItem } from '@/apis/home/schedules';
import { handleAxiosError } from '@/utils/handleAxiosError';

interface UseBriefCardDataResult {
  schedules: ScheduleItem[];
  remarks: RemarkItem[];
  loading: {
    schedules: boolean;
    remarks: boolean;
  };
  error: {
    schedules: string | null;
    remarks: string | null;
  };
}

export const useBriefCardData = (petId: number): UseBriefCardDataResult => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [remarks, setRemarks] = useState<RemarkItem[]>([]);

  const [loading, setLoading] = useState({
    schedules: true,
    remarks: true,
  });

  const [error, setError] = useState({
    schedules: null as string | null,
    remarks: null as string | null,
  });

  useEffect(() => {
    fetchHomeSchedules(petId)
      .then(setSchedules)
      .catch(err => {
        const message = handleAxiosError(err);
        setError(prev => ({ ...prev, schedules: message }));
        console.error('스케줄 로딩 실패:', err);
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, schedules: false }));
      });

    fetchHomeRemarks(petId)
      .then(setRemarks)
      .catch(err => {
        const message = handleAxiosError(err);
        setError(prev => ({ ...prev, remarks: message }));
        console.error('특이사항 로딩 실패:', err);
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, remarks: false }));
      });
  }, [petId]);

  return { schedules, remarks, loading, error };
};
