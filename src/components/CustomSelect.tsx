import { useState } from 'react';

import { ChevronDown } from 'lucide-react';
import styled from 'styled-components';

import { tx } from '@/styles/typography';
import type { BaseFieldProps } from '@/types/form';

interface CustomSelectProps extends BaseFieldProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const CustomSelect = ({ label, value, onChange, options }: CustomSelectProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectOption = (val: string) => {
    onChange(val);
    setIsDropdownOpen(false);
  };

  return (
    <FieldGroup>
      {label && <Label>{label}</Label>}
      <SelectTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <SelectSpan>{value}</SelectSpan>
        <ChevronDown size={18} color="var(--gray-700)" />
      </SelectTrigger>
      {isDropdownOpen && (
        <SelectDropdown>
          {options.map(opt => (
            <SelectOption key={opt.value} onClick={() => handleSelectOption(opt.value)}>
              {opt.label}
            </SelectOption>
          ))}
        </SelectDropdown>
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
  color: ${({ theme }) => theme.color.gray[600]};
  ${tx.body('reg14')};
`;

const SelectTrigger = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${({ theme }) => theme.color.main[100]};
  border: 1.5px solid ${({ theme }) => theme.color.main[500]};
  border-radius: 8px;
  cursor: pointer;
`;

const SelectSpan = styled.span`
  color: ${({ theme }) => theme.color.gray[700]};
  ${tx.body('semi14')};
`;

const SelectDropdown = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: -4px;
  padding: 10px 20px;
  background: ${({ theme }) => theme.color.main[100]};
  border: 1.5px solid ${({ theme }) => theme.color.main[500]};
  border-radius: 8px;
`;

const SelectOption = styled.li`
  color: ${({ theme }) => theme.color.gray[500]};
  ${tx.body('semi14')};
  cursor: pointer;
`;
