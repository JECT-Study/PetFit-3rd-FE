import styled from 'styled-components';

import { SLOT_ITEMS } from '@/constants/slot';

interface Props {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const SlotButton = ({ selectedIds, onToggle }: Props) => {
  return (
    <SlotContainer>
      {SLOT_ITEMS.map(({ id, Icon, label }) => (
        <Button key={id} $isSelected={selectedIds.includes(id)} onClick={() => onToggle(id)}>
          <Icon />
          {label}
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

  color: black;
  background-color: ${({ $isSelected }) => ($isSelected ? '#FFC533' : '#ffffff')};
  border: #ffc533 1px solid;
  border-radius: 50px;

  transition:
    background-color 0.2s ease,
    color 0.15s ease;
`;
