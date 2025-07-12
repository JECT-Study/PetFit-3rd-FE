import { useState } from 'react';

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

import { DAYS_OF_WEEK } from '@/constants/calendar';
import type { BaseFieldProps } from '@/types/form';
import { formatDate } from '@/utils/formatDate';

interface CustomDatePickerProps extends BaseFieldProps {
  value: string;
  onChange: (date: string) => void;
}

function getCalendarDates(year: number, month: number): string[] {
  const result: string[] = [];

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay(); // 0 (일) ~ 6 (토)

  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDate - i);
    result.push(formatDate(date));
  }

  const currMonthLastDate = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= currMonthLastDate; i++) {
    result.push(formatDate(new Date(year, month, i)));
  }

  const totalCells = Math.ceil(result.length / 7) * 7;
  const remaining = totalCells - result.length;

  for (let i = 1; i <= remaining; i++) {
    const date = new Date(year, month + 1, i);
    result.push(formatDate(date));
  }

  return result;
}

export const CustomDatePicker = ({ label, value, onChange }: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(value));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-based

  const handleDateClick = (date: string) => {
    onChange(date);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    const prev = new Date(viewDate);
    prev.setMonth(prev.getMonth() - 1);
    setViewDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + 1);
    setViewDate(next);
  };

  const calendarDates = getCalendarDates(year, month);

  return (
    <FieldGroup>
      {label && <Label>{label}</Label>}
      <SelectBox onClick={() => setIsOpen(!isOpen)}>
        <span>{value}</span>
        <Calendar size={18} />
      </SelectBox>
      {isOpen && (
        <CalendarDropdown>
          <CalendarHeader>
            <button onClick={handlePrevMonth}>
              <ChevronLeft size={18} />
            </button>
            <span>
              {year}년 {month + 1}월
            </span>
            <button onClick={handleNextMonth}>
              <ChevronRight size={18} />
            </button>
          </CalendarHeader>

          <SimpleCalendar>
            {DAYS_OF_WEEK.map(day => (
              <CalendarDay key={day} $isHeader>
                {day}
              </CalendarDay>
            ))}
            {calendarDates.map(date => {
              const dateObj = new Date(date);
              const day = dateObj.getDate();
              const isCurrentMonth = dateObj.getMonth() === month;
              const isSelected = date === value;

              return (
                <CalendarDay
                  key={date}
                  $dimmed={!isCurrentMonth}
                  $isSelected={isSelected}
                  onClick={() => handleDateClick(date)}
                >
                  {day}
                </CalendarDay>
              );
            })}
          </SimpleCalendar>
        </CalendarDropdown>
      )}
    </FieldGroup>
  );
};

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  padding-left: 8px;
  font-size: 14px;
  color: #333;
`;

const SelectBox = styled.div`
  padding: 12px 16px;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const CalendarDropdown = styled.div`
  margin-top: -4px;
  padding: 16px;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  padding-bottom: 10px;
`;

const SimpleCalendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const CalendarDay = styled.div<{
  $dimmed?: boolean;
  $isSelected?: boolean;
  $isHeader?: boolean;
}>`
  max-width: 38px;
  padding: 10px 8px;
  text-align: center;
  font-weight: ${({ $isHeader }) => ($isHeader ? 'bold' : 'normal')};
  color: ${({ $isHeader, $dimmed }) => ($isHeader ? '#373737' : $dimmed ? '#ccc' : '#000')};
  background-color: ${({ $dimmed, $isSelected, $isHeader }) =>
    $isHeader ? 'transparent' : $isSelected ? '#FFE299' : $dimmed ? '#fff' : 'transparent'};
  border: ${({ $isHeader }) => ($isHeader ? 'none' : '2px solid #fff')};
  cursor: ${({ $isHeader }) => ($isHeader ? 'default' : 'pointer')};

  &:hover {
    background-color: ${({ $isHeader }) => ($isHeader ? 'transparent' : '#fde68a')};
  }
`;
