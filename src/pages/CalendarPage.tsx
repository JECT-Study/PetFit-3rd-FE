import styled from 'styled-components';

import { MonthlyViewPanel } from '@/features/calendar/MonthlyViewPanel';
import { TitleHeader } from '@/components/common/TitleHeader';
import { useState } from 'react';
import { DayDetailsPanel } from '@/features/calendar/DayDetailsPanel';

export const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Wrapper>
      <TitleHeader title="달력" />

      <MonthlyViewPanel selectedDate={selectedDate} onDateClick={setSelectedDate} />

      <Line />

      <DayDetailsPanel selectedDate={selectedDate} />
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Line = styled.hr`
  height: 4px;
  background: #d9d9d9;
  border: none;
`;
