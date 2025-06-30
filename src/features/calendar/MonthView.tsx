import styled from 'styled-components';

import { LEGEND_ITEMS } from '@/constants/calendar';
import { MOCK_CALENDAR_MARKS } from '@/mocks/calendarData';
import type { CalendarMarkType } from '@/types/calendar';
import { formatDate } from '@/utils/formatDate';

interface Props {
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  manuallySelected: boolean;
}

// 월간 날짜 생성
function getMonthsDates(year: number, month: number): string[] {
  const result: string[] = [];
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startDay = firstDayOfMonth.getDay(); // 0 (일) ~ 6 (토)
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();
  const currMonthLastDate = new Date(year, month, 0).getDate();

  // 이전 달 날짜
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 2, prevMonthLastDate - i);
    result.push(formatDate(date));
  }

  // 현재 달 날짜
  for (let i = 1; i <= currMonthLastDate; i++) {
    result.push(formatDate(new Date(year, month - 1, i)));
  }

  // 다음 달 날짜 채우기
  const totalCells = Math.ceil(result.length / 7) * 7; // 7의 배수 맞춤
  const remaining = totalCells - result.length;

  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, month, i); // 정확히 다음 달 날짜
    result.push(formatDate(nextDate));
  }

  return result;
}

export const MonthView = ({ year, month, selectedDate, onSelectDate, manuallySelected }: Props) => {
  const dates = getMonthsDates(year, month);

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
