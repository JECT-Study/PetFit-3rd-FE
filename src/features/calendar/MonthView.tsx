import styled from 'styled-components';

import { LEGEND_ITEMS } from '@/constants/calendar';
import { MOCK_CALENDAR_MARKS } from '@/mocks/calendarData';
import type { CalendarMarkType } from '@/types/calendar';
import { getMonthDates, isSameMonth } from '@/utils/calendar';

interface Props {
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  manuallySelected: boolean;
}

export const MonthView = ({ year, month, selectedDate, onSelectDate, manuallySelected }: Props) => {
  const dates = getMonthDates(year, month); // 월간 날짜 생성

  return (
    <Grid>
      {dates.map(date => {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const isInCurrentMonth = isSameMonth(dateObj, year, month);
        const isSelected = selectedDate === date;

        const dots = MOCK_CALENDAR_MARKS[date] || [];
        const dotColor = (type: CalendarMarkType) =>
          isInCurrentMonth ? LEGEND_ITEMS[type].color : '#BDBDBD';

        return (
          <Cell
            key={date}
            $selected={isSelected}
            $filled={isSelected && manuallySelected}
            onClick={() => onSelectDate(date)}
          >
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

const Cell = styled.div<{ $selected?: boolean; $filled?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 48px;
  border-radius: 6px;
  border: ${({ $selected }) => ($selected ? '2px solid orange' : 'none')};
  background-color: ${({ $filled }) => ($filled ? '#FFFBEA' : 'transparent')};
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
