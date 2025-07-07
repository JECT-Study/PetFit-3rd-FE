import { Ellipsis, Check } from 'lucide-react';
import styled from 'styled-components';

import { SLOT_ITEMS } from '@/constants/slot';
import { routineData } from '@/mocks/routineData';

export const RoutineItem = () => {
  return (
    <div>
      {routineData.map(r => {
        const slot = SLOT_ITEMS.find(s => s.id === r.id)!;
        return (
          <Container key={r.id}>
            <ItemContainer>
              <Check />

              <MainInfoContainer>
                <MainInfo>
                  <img src={slot.icon} />
                  <TitleText>{slot.label}</TitleText>
                  <AmountText>
                    0 {slot.unit} / 150 {slot.unit}
                  </AmountText>
                </MainInfo>

                <MemoInfo>메모메모메모메모메모메모</MemoInfo>
              </MainInfoContainer>
            </ItemContainer>

            <NoteButton>
              <Ellipsis />
            </NoteButton>
          </Container>
        );
      })}
    </div>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px #dddddd solid;
  align-items: center;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 10px 0;
`;
const MainInfoContainer = styled.div`
  gap: 5px;
`;

const TitleText = styled.div`
  font-weight: 500;
`;
const AmountText = styled.div``;
const MainInfo = styled.div`
  display: flex;
  margin: 5px 0;
  gap: 6px;
  font-size: 14px;
`;

const MemoInfo = styled.div`
  font-size: 14px;
  color: gray;
`;
const NoteButton = styled.div``;
