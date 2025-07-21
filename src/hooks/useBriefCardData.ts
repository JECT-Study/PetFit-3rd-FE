// hooks/useBriefCardData.ts
import { useEffect, useState } from 'react';

import {
  fetchHomeRemarks,
  fetchHomeSchedules,
  type RemarkItem,
  type ScheduleItem,
} from '@/apis/home/briefCard';
import { handleAxiosError } from '@/utils/handleAxiosError';

interface UseBriefCardDataResult {
  schedules: ScheduleItem[];
  remarks: RemarkItem[];
  loading: boolean;
  error: string | null;
}

export const useBriefCardData = (petId: number): UseBriefCardDataResult => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [remarks, setRemarks] = useState<RemarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, r] = await Promise.all([fetchHomeSchedules(petId), fetchHomeRemarks(petId)]);
        setSchedules(s);
        setRemarks(r);
      } catch (err) {
        const message = handleAxiosError(err);
        setError(message);
        console.error(message, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petId]);

  return { schedules, remarks, loading, error };
};
