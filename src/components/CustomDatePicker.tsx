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
} from '@/utils/calendar';
import { useClickOutside } from '@/hooks/useClickOutside';

interface CustomDatePickerProps {
  fieldLabel?: string;
  value: Date;
  onChange: (date: Date) => void;
  withYearSelect?: boolean;
}

const YEAR_RANGE = 36; // 몇 년을 표시할지 (개수)

export const CustomDatePicker = ({
  fieldLabel,
  value: selectedDate,
  onChange,
  withYearSelect,
}: CustomDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [visibleDate, setVisibleDate] = useState(new Date(selectedDate));
  const [selectingYear, setSelectingYear] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // ✅ 외부 클릭 닫기: 훅 적용 (mousedown + touchstart)
  useClickOutside<HTMLDivElement>(rootRef, open, () => setOpen(false));

  // 열 때 현재 선택 월로 스냅
  const handleToggleCalendar = () => {
    if (!open) setVisibleDate(new Date(selectedDate));
    setOpen(o => !o);
    setSelectingYear(false);
  };

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
    onChange(date);
    setOpen(false);
    setSelectingYear(false);
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
        <TriggerButton
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={handleToggleCalendar}
        >
          <TriggerSpan>{formatDate(selectedDate)}</TriggerSpan>
          <Calendar size={20} />
        </TriggerButton>

        {open && (
          <CalendarPanel role="dialog" aria-label="달력">
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
                <TriggerSpan>
                  {getYear(visibleDate)}년 {getMonthNumber(visibleDate)}월
                </TriggerSpan>
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
                    const isSelected = isSameDay(date, selectedDate);

                    return (
                      <DateCell
                        key={date.toISOString()}
                        $dimmed={!isCurrentMonth}
                        $isSelected={isSelected}
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
        )}
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
  color: ${({ theme }) => theme.color.gray[500]};
  ${tx.body('reg14')};
`;

const TriggerButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray[300]};
  color: ${({ theme }) => theme.color.gray[700]};
  border-radius: 8px;
`;

const TriggerSpan = styled.span`
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
  max-height: 240px; // 5줄까지 보여주고 나머진 스크롤
  overflow-y: auto;
`;

const YearCell = styled.div<{
  $dimmed?: boolean;
  $isSelected?: boolean;
  $isHeader?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 48px;

  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.main[100] : theme.color.white};
  border: 2px solid
    ${({ theme, $isSelected }) => ($isSelected ? theme.color.main[500] : theme.color.white)};
  color: ${({ theme, $dimmed }) => ($dimmed ? theme.color.gray[300] : theme.color.gray[500])};
  ${tx.body('med16')};
  border-radius: 8px;
  cursor: pointer;

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
  $isSelected?: boolean;
  $isHeader?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  ${tx.body('med16')};

  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.main[100] : theme.color.white};
  border: 2px solid
    ${({ theme, $isSelected }) => ($isSelected ? theme.color.main[500] : theme.color.white)};
  color: ${({ theme, $dimmed }) => ($dimmed ? theme.color.gray[300] : theme.color.gray[500])};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.color.main[500]};
  }
`;
