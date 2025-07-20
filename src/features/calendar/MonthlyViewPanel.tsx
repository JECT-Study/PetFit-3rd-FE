import { useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

import { DAYS_OF_WEEK, LEGEND, PET_TYPE_ICON_MAP } from '@/constants/calendar';
import { MonthView } from '@/features/calendar/MonthView';
import { MOCK_PETS } from '@/mocks/calendarData';
import { getMonthNumber, getYear, isSameMonth } from '@/utils/calendar';

interface MonthlyViewPanelProps {
  viewDate: Date;
  selectedDate: Date;
  onChangeViewDate: (newDate: Date) => void;
  onDateClick: (date: Date) => void;
}

export const MonthlyViewPanel = ({
  viewDate,
  selectedDate,
  onChangeViewDate,
  onDateClick,
}: MonthlyViewPanelProps) => {
  const [selectedPetId, setSelectedPetId] = useState<number>(1);

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
      {/* 동물 종류 탭 */}
      <PetTabs>
        {MOCK_PETS.map(pet => {
          const Icon = PET_TYPE_ICON_MAP[pet.type];

          return (
            <PetTab
              key={pet.id}
              $active={selectedPetId === pet.id}
              onClick={() => setSelectedPetId(pet.id)}
            >
              <PetIconWrapper $active={selectedPetId === pet.id}>
                <Icon width={36} height={36} />
              </PetIconWrapper>
              <span>{pet.name}</span>
            </PetTab>
          );
        })}
      </PetTabs>

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

        <MonthView viewDate={viewDate} selectedDate={selectedDate} onDateClick={onDateClick} />
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

const PetTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-left: 20px;
`;

const PetTab = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#000' : '#888')};
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
`;

const PetIconWrapper = styled.div<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ $active }) => ($active ? '#E3F2FD' : '#eee')};
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ $active }) => ($active ? '2px solid #2196F3' : 'none')};
  color: ${({ $active }) => ($active ? '#2196F3' : '#999')};
`;

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
