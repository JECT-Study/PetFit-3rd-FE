import { useRef, useState } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

import { DAYS_OF_WEEK } from '@/constants/calendar';
import { tx } from '@/styles/typography';
import {
  formatDate,
  getMonthDates,
  getMonthNumber,
  getYear,
  isSameDay,
  isSameMonth,
  isWithinRange,
} from '@/utils/calendar';

interface CustomDateRangePickerProps {
  fieldLabel?: string;
  startDate: Date;
  endDate: Date;
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  withYearSelect?: boolean;
}

const YEAR_RANGE = 36;

export const CustomDateRangePicker = ({
  fieldLabel,
  startDate,
  endDate,
  onChange,
  withYearSelect,
}: CustomDateRangePickerProps) => {
  const [visibleDate, setVisibleDate] = useState(new Date(startDate));
  const [selectingYear, setSelectingYear] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleClickPrevMonth = () => {
    const prev = new Date(visibleDate);
    prev.setMonth(prev.getMonth() - 1);
    setVisibleDate(prev);
  };

  const handleClickNextMonth = () => {
    const next = new Date(visibleDate);
    next.setMonth(next.getMonth() + 1);
    setVisibleDate(next);
  };

  const handleSelectDate = (date: Date) => {
    if (selectingStart) {
      onChange({ startDate: date, endDate: date });
      setSelectingStart(false);
    } else {
      if (date < startDate) {
        onChange({ startDate: date, endDate: startDate });
      } else {
        onChange({ startDate, endDate: date });
      }
      setSelectingStart(true);
    }
  };

  const handleToggleYear = () => {
    if (withYearSelect) setSelectingYear(v => !v);
  };

  const calendarDates = getMonthDates(visibleDate);

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - (YEAR_RANGE - 1);
  const yearList = Array.from({ length: YEAR_RANGE }, (_, i) => startYear + i);

  return (
    <FieldGroup>
      {fieldLabel && <Label>{fieldLabel}</Label>}

      <CalendarBlock ref={rootRef}>
        <DateContainer>
          <DateText>
            {formatDate(startDate)} ~ {formatDate(endDate)}
          </DateText>
          <Calendar size={20} />
        </DateContainer>

        <CalendarPanel role="dialog" aria-label="기간 선택 달력">
          <CalendarHeaderRow>
            <IconBtn type="button" onClick={handleClickPrevMonth} aria-label="이전 달">
              <ChevronLeft size={16} />
            </IconBtn>

            <HeaderToggleButton
              type="button"
              onClick={handleToggleYear}
              aria-label="연도 선택 전환"
              aria-expanded={selectingYear}
            >
              <DateText>
                {getYear(visibleDate)}년 {getMonthNumber(visibleDate)}월
              </DateText>
              {withYearSelect && <ChevronDown size={16} />}
            </HeaderToggleButton>

            <IconBtn type="button" onClick={handleClickNextMonth} aria-label="다음 달">
              <ChevronRight size={16} />
            </IconBtn>
          </CalendarHeaderRow>

          {selectingYear ? (
            <YearScrollContainer>
              {yearList.map(year => (
                <YearCell
                  key={year}
                  $isSelected={year === getYear(visibleDate)}
                  onClick={() => {
                    const newDate = new Date(visibleDate);
                    newDate.setFullYear(year);
                    setVisibleDate(newDate);
                    setSelectingYear(false);
                  }}
                >
                  {year}
                </YearCell>
              ))}
            </YearScrollContainer>
          ) : (
            <>
              <DayOfWeekRow>
                {DAYS_OF_WEEK.map(day => (
                  <CalendarHeaderCell key={day}>{day}</CalendarHeaderCell>
                ))}
              </DayOfWeekRow>

              <CalendarGrid>
                {calendarDates.map(date => {
                  const day = date.getDate();
                  const isCurrentMonth = isSameMonth(date, visibleDate);
                  const isSelectedStart = isSameDay(date, startDate);
                  const isSelectedEnd = isSameDay(date, endDate);
                  const inRange = isWithinRange(date, startDate, endDate);

                  return (
                    <DateCell
                      key={date.toISOString()}
                      $dimmed={!isCurrentMonth}
                      $isSelectedStart={isSelectedStart}
                      $isSelectedEnd={isSelectedEnd}
                      $inRange={inRange}
                      onClick={() => handleSelectDate(date)}
                    >
                      {day}
                    </DateCell>
                  );
                })}
              </CalendarGrid>
            </>
          )}
        </CalendarPanel>
      </CalendarBlock>
    </FieldGroup>
  );
};

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CalendarBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  padding-left: 8px;
  color: ${({ theme }) => theme.color.gray[600]};
  ${tx.body('reg14')};
`;

const DateContainer = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray[300]};
  color: ${({ theme }) => theme.color.gray[700]};
  border-radius: 8px;
`;

const DateText = styled.span`
  ${tx.body('reg14')};
`;

const CalendarPanel = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray[300]};
  border-radius: 8px;
`;

const CalendarHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const IconBtn = styled.button`
  color: ${({ theme }) => theme.color.gray[700]};
`;

const HeaderToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.color.gray[700]};
  ${tx.body('semi14')};
`;

const YearScrollContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0 4px;
  max-height: 240px;
  overflow-y: auto;
`;

const YearCell = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.main[100] : theme.color.white};
  border: 2px solid
    ${({ theme, $isSelected }) => ($isSelected ? theme.color.main[500] : theme.color.white)};
  border-radius: 8px;
  cursor: pointer;
  ${tx.body('med16')};

  &:hover {
    border-color: ${({ theme }) => theme.color.main[500]};
  }
`;

const DayOfWeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const CalendarHeaderCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 46px;
  color: ${({ theme }) => theme.color.black};
  ${tx.body('med16')};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DateCell = styled.div<{
  $dimmed?: boolean;
  $isSelectedStart?: boolean;
  $isSelectedEnd?: boolean;
  $inRange?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  margin: 2px 0;
  ${tx.body('med16')};
  background: ${({ theme, $inRange, $isSelectedStart, $isSelectedEnd }) => {
    if ($isSelectedStart || $isSelectedEnd) return theme.color.main[100];
    if ($inRange) return theme.color.gray[100];
    return theme.color.white;
  }};
  border: 2px solid
    ${({ theme, $isSelectedStart, $isSelectedEnd }) =>
      $isSelectedStart || $isSelectedEnd ? theme.color.main[500] : 'transparent'};

  border-radius: ${({ $isSelectedStart, $isSelectedEnd }) => {
    if ($isSelectedStart && $isSelectedEnd) return '8px';
    if ($isSelectedStart) return '8px 0 0 8px';
    if ($isSelectedEnd) return '0 8px 8px 0';
    return '0';
  }};
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.color.main[500]};
  }
`;
