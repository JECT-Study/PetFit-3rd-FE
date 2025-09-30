import { useQueries } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { fetchMonthlyEntries } from '@/apis/calendar';
import { DAYS_OF_WEEK, LEGEND } from '@/constants/calendar';
import { MonthView } from '@/features/calendar/MonthView';
import type { RootState } from '@/store/store';
import type { CalendarMarkType } from '@/types/calendar';
import { getMonthNumber, getSurroundingMonths, getYear, isSameMonth } from '@/utils/calendar';
import { useState } from 'react';

interface MonthlyViewPanelProps {
  selectedDate: Date;
  onDateClick: (date: Date) => void;
}

export const MonthlyViewPanel = ({ selectedDate, onDateClick }: MonthlyViewPanelProps) => {
  // ✅ 로컬 뷰 상태(현재 보고 있는 월)
  const [viewMonth, setViewMonth] = useState<Date>(new Date(selectedDate));

  const selectedPetId = useSelector((state: RootState) => state.selectedPet.id);

  const formattedMonths = getSurroundingMonths(viewDate);

  const results = useQueries({
    queries: formattedMonths.map(month => ({
      queryKey: ['monthlyEntries', selectedPetId, month],
      queryFn: () => fetchMonthlyEntries(selectedPetId ?? -1, month),
      enabled: !!selectedPetId,
      staleTime: 1000 * 60 * 5,
    })),
  });

  const allEntries = results.flatMap(r => r.data ?? []);

  // 📌 CalendarMarkType으로 변환 (scheduled 제외)
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

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() - 1);

    // 이동한 달이 selectedDate와 동일한 달이면 selectedDate 기준으로 viewDate 설정
    if (isSameMonth(newDate, selectedDate)) {
      onChangeViewDate(selectedDate);
    } else {
      const lastDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
      onChangeViewDate(lastDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(viewDate.getMonth() + 1);

    if (isSameMonth(newDate, selectedDate)) {
      onChangeViewDate(selectedDate);
    } else {
      const firstDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      onChangeViewDate(firstDate);
    }
  };

  return (
    <>
      {/* 달력 뷰 영역 */}
      <CalendarMonthWrapper>
        <MonthNav>
          <button onClick={handlePrevMonth}>
            <ChevronLeft size={20} />
          </button>
          <MonthLabel>{`${getYear(viewDate)}년 ${getMonthNumber(viewDate)}월`}</MonthLabel>
          <button onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </button>
        </MonthNav>

        <DayHeaderRow>
          {DAYS_OF_WEEK.map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
        </DayHeaderRow>

        <MonthView
          viewDate={viewDate}
          selectedDate={selectedDate}
          onDateClick={onDateClick}
          calendarMarks={calendarMarks}
        />
      </CalendarMonthWrapper>

      {/* 범례 영역 */}
      <LegendRow>
        {LEGEND.map(({ key, label, color }) => (
          <LegendItem key={key}>
            <Dot $color={color} />
            <LegendLabel>{label}</LegendLabel>
          </LegendItem>
        ))}
      </LegendRow>
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
  margin-bottom: 10px;
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  text-align: center;
  font-weight: bold;
`;

const LegendRow = styled.div`
  display: flex;
  margin-top: 10px;
  padding-left: 32px;
  gap: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  background-color: ${({ $color }) => $color};
  border-radius: 50%;
`;

const LegendLabel = styled.span`
  font-size: 14px;
`;
