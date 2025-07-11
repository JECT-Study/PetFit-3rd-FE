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
  top: 70px;
  width: 100%;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
  padding: 8px 0;
  z-index: 100;
`;

const Option = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: #fef3c7;
  }
`;
