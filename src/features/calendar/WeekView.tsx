import styled from 'styled-components';

import { LEGEND_ITEMS } from '@/constants/calendar';
import { MOCK_CALENDAR_MARKS } from '@/mocks/calendarData';
import type { CalendarMarkType } from '@/types/calendar';
import { formatDate } from '@/utils/calendar';

interface WeekViewProps {
  year: number;
  month: number;
  selectedDate: string;
  onSelectedDate: (date: string) => void;
}

// 주간 날짜 생성
function getWeekDates(date: Date): string[] {
  const result: string[] = [];
  const dayOfWeek = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayOfWeek);

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    result.push(formatDate(d));
  }

  return result;
}

export const WeekView = ({ year, month, selectedDate, onSelectedDate }: WeekViewProps) => {
  const currentDate = new Date(selectedDate);
  const dates = getWeekDates(currentDate);

  return (
    <Grid>
      {dates.map(date => {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const isSelected = selectedDate === date;
        const isInCurrentView = dateObj.getFullYear() === year && dateObj.getMonth() + 1 === month;

        const dots = MOCK_CALENDAR_MARKS[date] || [];
        const dotColor = (type: CalendarMarkType) =>
          isInCurrentView ? LEGEND_ITEMS[type].color : '#BDBDBD';

        return (
          <Cell key={date} $selected={isSelected} onClick={() => onSelectedDate(date)}>
            <DateNumber>{day}</DateNumber>
            <DotRow hasDots={dots.length > 0}>
              {dots.map(type => (
                <Dot key={type} color={dotColor(type)} />
              ))}
            </DotRow>
          </Cell>
        );
      })}
    </Grid>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 4px;
`;

const Cell = styled.div<{ $selected?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 48px;
  border-radius: 6px;
  border: ${({ $selected }) => ($selected ? '2px solid orange' : 'none')};
  background-color: ${({ $selected }) => ($selected ? '#FFF3E0' : 'transparent')};
  cursor: pointer;
`;

const DateNumber = styled.span`
  font-size: 14px;
  text-align: center;
`;

const DotRow = styled.div<{ hasDots: boolean }>`
  display: flex;
  justify-content: center;
  gap: 2px;
  min-height: 6px; // dot이 없는 날에도 영역 확보
  margin-top: 4px;
`;

const Dot = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
`;
