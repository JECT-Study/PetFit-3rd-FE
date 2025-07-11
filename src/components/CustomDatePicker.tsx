import { useState } from 'react';

import { Calendar } from 'lucide-react';
import styled from 'styled-components';

import type { BaseFieldProps } from '@/types/form';

interface CustomDatePickerProps extends BaseFieldProps {
  value: string;
  onChange: (date: string) => void;
}

export const CustomDatePicker = ({ label, value, onChange }: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateClick = (date: string) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <FieldGroup>
      {label && <Label>{label}</Label>}
      <SelectBox onClick={() => setIsOpen(!isOpen)}>
        <span>{value}</span>
        <Calendar size={18} />
      </SelectBox>
      {isOpen && (
        <CalendarDropdown>
          <SimpleCalendar>
            {[...Array(30)].map((_, i) => {
              const day = i + 1;
              const formatted = `2025-06-${day.toString().padStart(2, '0')}`;
              return (
                <CalendarDay key={day} onClick={() => handleDateClick(formatted)}>
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
  position: relative;
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

const Dropdown = styled.div`
  position: absolute;
  bottom: 60px;
  width: 100%;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
  padding: 8px 0;
  z-index: 100;
`;

const CalendarDropdown = styled(Dropdown)`
  padding: 16px;
`;

const SimpleCalendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const CalendarDay = styled.div`
  text-align: center;
  padding: 6px 0;
  cursor: pointer;
  border-radius: 6px;
  &:hover {
    background-color: #fde68a;
  }
`;
