import { useState } from 'react';

import styled from 'styled-components';

import { MonthlyViewPanel } from '@/features/calendar/MonthlyViewPanel';
import { WeeklyViewPanel } from '@/features/calendar/WeeklyViewPanel';
import type { CalendarMode } from '@/types/calendar';
import { isSameDay } from '@/utils/calendar';

export const CalendarPage = () => {
  const [mode, setMode] = useState<CalendarMode>('month');
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSelectedtDate = (date: Date) => {
    // 주간 보기에서 동일 날짜를 다시 선택하면 월간 모드로 전환
    if (mode === 'week' && isSameDay(selectedDate, date)) {
      setMode('month');
    } else {
      setMode('week');
    }
    setSelectedDate(date);
    setViewDate(date); // 선택된 날짜 기준으로 viewDate도 갱신
  };

  return (
    <Wrapper>
      <Header>달력</Header>

      {mode === 'month' && (
        <MonthlyViewPanel
          viewDate={viewDate}
          selectedDate={selectedDate}
          onChangeViewDate={setViewDate}
          onDateClick={handleSelectedtDate}
        />
      )}

      {mode === 'week' && (
        <WeeklyViewPanel
          viewDate={viewDate}
          selectedDate={selectedDate}
          onChangeViewDate={setViewDate}
          onDateClick={handleSelectedtDate}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Header = styled.h2`
  text-align: center;
  padding: 18px 0;
`;
