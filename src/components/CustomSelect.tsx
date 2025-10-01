import { useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import styled from 'styled-components';

import { tx } from '@/styles/typography';
import { useClickOutside } from '@/hooks/useClickOutside';

interface CustomSelectProps<T extends string> {
  fieldLabel?: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

export const CustomSelect = <T extends string>({
  fieldLabel,
  options,
  value,
  onChange,
}: CustomSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // ✅ 외부 클릭 닫기: 훅 적용 (mousedown + touchstart)
  useClickOutside<HTMLDivElement>(rootRef, open, () => setOpen(false));

  const handleSelectOption = (v: T) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <FieldGroup>
      {fieldLabel && <Label>{fieldLabel}</Label>}

      <SelectBlock ref={rootRef}>
        <SelectTrigger
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <SelectSpan>{value}</SelectSpan>
          <ChevronDown size={20} />
        </SelectTrigger>

        {open && (
          <SelectDropdown role="listbox">
            {options.map(opt => (
              <SelectOption
                key={opt}
                role="option"
                aria-selected={opt === value}
                onClick={() => handleSelectOption(opt)}
              >
                {opt}
              </SelectOption>
            ))}
          </SelectDropdown>
        )}
      </SelectBlock>
    </FieldGroup>
  );
};

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  padding-left: 8px;
  color: ${({ theme }) => theme.color.gray[500]};
  ${tx.body('reg14')};
`;

const SelectTrigger = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray[300]};
  color: ${({ theme }) => theme.color.gray[700]};
  border-radius: 8px;
`;

const SelectSpan = styled.span`
  ${tx.body('reg14')};
`;

const SelectDropdown = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray[300]};
  color: ${({ theme }) => theme.color.gray[500]};
  border-radius: 8px;
`;

const SelectOption = styled.li`
  ${tx.body('reg14')};
  cursor: pointer;
`;
