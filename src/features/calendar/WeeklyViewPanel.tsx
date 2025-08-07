import { useQueries } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { fetchMonthlyEntries } from '@/apis/calendar';
import { DAYS_OF_WEEK } from '@/constants/calendar';
import { WeeklyDetailsSection } from '@/features/calendar/WeeklyDetailsSection';
import { WeekView } from '@/features/calendar/WeekView';
import type { RootState } from '@/store/store';
import type { CalendarMarkType } from '@/types/calendar';
import { getMonthNumber, getSurroundingMonths } from '@/utils/calendar';

interface WeeklyViewPanelProps {
  viewDate: Date;
  selectedDate: Date;
  onChangeViewDate: (newDate: Date) => void;
  onDateClick: (date: Date) => void;
}

const isSameWeek = (date1: Date, date2: Date) => {
  const startOfWeek = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return d;
  };
  return startOfWeek(date1).toDateString() === startOfWeek(date2).toDateString();
};

export const WeeklyViewPanel = ({
  viewDate,
  selectedDate,
  onChangeViewDate,
  onDateClick,
}: WeeklyViewPanelProps) => {
  const selectedPetId = useSelector((state: RootState) => state.selectedPet.id);

  const formattedMonths = getSurroundingMonths(selectedDate); // ['2025-06', '2025-07', '2025-08']

  // ✅ 날짜별 엔트리 조회 (병렬 요청)
  const results = useQueries({
    queries: formattedMonths.map(month => ({
      queryKey: ['monthlyEntries', selectedPetId, month],
      queryFn: () => fetchMonthlyEntries(selectedPetId ?? -1, month),
      enabled: !!selectedPetId,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const allEntries = results.flatMap(r => r.data ?? []);

  // ✅ 마킹 정보로 변환
  const calendarMarks: Record<string, CalendarMarkType[]> = allEntries.reduce(
    (acc, entry) => {
      const types: CalendarMarkType[] = [];

      if (entry.completed) types.push('completed');
      if (entry.memo) types.push('memo');
      if (entry.remarked) types.push('note'); // 👈 renamed

      if (types.length > 0) {
        acc[entry.entryDate] = types;
      }

      return acc;
    },
    {} as Record<string, CalendarMarkType[]>
  );

  // ✅ 월/주차 표기
  const getWeekOfMonth = (date: Date): number => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDay.getDay(); // 0: 일요일 ~ 6: 토요일
    const offsetDate = date.getDate() + dayOfWeek;
    return Math.ceil(offsetDate / 7);
  };

  // ✅ 이전 주 이동
  const handlePrevWeek = () => {
    const prevWeek = new Date(viewDate);
    prevWeek.setDate(viewDate.getDate() - 7);

    if (isSameWeek(prevWeek, selectedDate)) {
      onChangeViewDate(selectedDate);
    } else {
      const sunday = new Date(prevWeek);
      sunday.setDate(sunday.getDate() - sunday.getDay()); // 주 시작일 계산
      const lastDayPrevWeek = new Date(sunday);
      lastDayPrevWeek.setDate(sunday.getDate() + 6); // 이전 주의 마지막 날 (토요일)
      onChangeViewDate(lastDayPrevWeek);
    }
  };

  // ✅ 다음 주 이동
  const handleNextWeek = () => {
    const nextWeek = new Date(viewDate);
    nextWeek.setDate(viewDate.getDate() + 7);

    if (isSameWeek(nextWeek, selectedDate)) {
      onChangeViewDate(selectedDate);
    } else {
      const sunday = new Date(nextWeek);
      sunday.setDate(sunday.getDate() - sunday.getDay()); // 주 시작일 계산
      const firstDayNextWeek = new Date(sunday);
      onChangeViewDate(firstDayNextWeek); // 다음 주의 시작일 (일요일)
    }
  };

  return (
    <>
      <CalendarMonthWrapper>
        <MonthNav>
          <button onClick={handlePrevWeek}>
            <ChevronLeft size={20} />
          </button>
          <MonthLabel>{`${getMonthNumber(viewDate)}월 ${getWeekOfMonth(viewDate)}주차`}</MonthLabel>
          <button onClick={handleNextWeek}>
            <ChevronRight size={20} />
          </button>
        </MonthNav>

        <DayHeaderRow>
          {DAYS_OF_WEEK.map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
        </DayHeaderRow>

        <WeekView
          viewDate={viewDate}
          selectedDate={selectedDate}
          onDateClick={onDateClick}
          calendarMarks={calendarMarks}
        />
      </CalendarMonthWrapper>

      <WeeklyDetailsSection selectedDate={selectedDate} />
    </>
  );
};

const CalendarMonthWrapper = styled.div`
  margin-top: 20px;
  padding: 0 20px;
`;

const MonthNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const MonthLabel = styled.div`
  font-weight: bold;
`;

const DayHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  text-align: center;
  font-weight: bold;
`;
