import { Menu } from 'lucide-react';
import styled from 'styled-components';

import { SLOT_ITEMS } from '@/constants/slot';

interface Props {
  selectedIds: string[];
}
export const SlotInput = ({ selectedIds }: Props) => {
  return (
    <div>
      {SLOT_ITEMS.filter(({ id }) => selectedIds.includes(id)).map(
        ({ id, icon, label, unit, placeholder }) => (
          <InputContainer key={id}>
            <InputHeader>
              <InputTitle>
                <img src={icon} alt={label} /> {label}
              </InputTitle>
              {unit ? <InputSubtitle>(단위: {unit})</InputSubtitle> : null}
            </InputHeader>
            <InputContent>
              <Input placeholder={placeholder} />
              <Menu color={'#A5A5A5'} />
            </InputContent>
          </InputContainer>
        )
      )}
    </div>
  );
};

const InputContainer = styled.div`
  border-bottom: 1px solid #e0e0e0;
  margin: 10px 0;
`;

const InputHeader = styled.div`
  display: flex;
  gap: 5px;
  font-size: 12px;
`;

const InputTitle = styled.div`
  display: flex;
  gap: 5px;
`;
const InputSubtitle = styled.div`
  color: gray;
`;
const InputContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  width: calc(100%);
  height: 45px;
  border-radius: 8px;
  border-width: 1px;
  padding: 12px 20px;
  margin: 12px 0px;
  background: #fff8e5;
  border: 1px solid #dddddd;
  font-size: 14px;
`;
