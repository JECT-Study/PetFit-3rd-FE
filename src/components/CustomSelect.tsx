import { useState } from 'react';

import { ChevronDown } from 'lucide-react';
import styled from 'styled-components';

import type { BaseFieldProps } from '@/types/form';

interface CustomSelectProps extends BaseFieldProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const CustomSelect = ({ label, value, onChange, options }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <FieldGroup>
      {label && <Label>{label}</Label>}
      <SelectBox onClick={() => setIsOpen(!isOpen)}>
        <span>{value}</span>
        <ChevronDown size={18} />
      </SelectBox>
      {isOpen && (
        <Dropdown>
          {options.map(opt => (
            <Option key={opt.value} onClick={() => handleSelect(opt.value)}>
              {opt.label}
            </Option>
          ))}
        </Dropdown>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
  cursor: pointer;
`;

const Dropdown = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: -4px;
  padding: 10px 20px;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
`;

const Option = styled.li`
  color: #666666;
  cursor: pointer;
  &:hover {
    background-color: #fef3c7;
  }
`;
