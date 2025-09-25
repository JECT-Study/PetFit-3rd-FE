import { X } from 'lucide-react';
import styled from 'styled-components';

import { SLOT_ITEMS } from '@/constants/slot';

interface Props {
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
}

export const SlotButton = ({ selectedIds, onSelect, onDeselect }: Props) => {
  return (
    <SlotContainer>
      {SLOT_ITEMS.map(({ id, label }) => (
        <Button key={id} $isSelected={selectedIds.includes(id)} onClick={() => onSelect(id)}>
          <Label>{label}</Label>
          {selectedIds.includes(id) && (
            <X
              size={16}
              onClick={e => {
                e.stopPropagation();
                onDeselect(id);
              }}
            />
          )}
        </Button>
      ))}
    </SlotContainer>
  );
};

const SlotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Button = styled.button<{ $isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 8px 12px;
  gap: 5px;

  background-color: ${({ $isSelected }) => ($isSelected ? '#FFC533' : '#ffffff')};
  border: #ffc533 1px solid;
  border-radius: 50px;

  transition:
    background-color 0.2s ease,
    color 0.15s ease;
`;

const Label = styled.div`
  color: black;
`;
