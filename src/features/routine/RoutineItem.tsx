import { Ellipsis, Check } from 'lucide-react';
import styled from 'styled-components';

import { SLOT_ITEMS } from '@/constants/slot';
import { routineData } from '@/mocks/routineData';

export const RoutineItem = () => {
  return (
    <div>
      {routineData.map(rtn => {
        const { id, Icon, label, unit } = SLOT_ITEMS.find(slot => slot.id === rtn.id)!;
        return (
          <Container key={id}>
            <ItemContainer>
              <Check width={24} color="#DDDDDD" />

              <MainInfoContainer>
                <MainInfo>
                  <Icon width={16} color="#4D9DE0" />
                  <TitleText>{label}</TitleText>
                  <AmountText>
                    {rtn.current !== undefined ? `${rtn.current} ${unit} / ` : null} {rtn.default}{' '}
                    {unit}
                  </AmountText>
                </MainInfo>

                <MemoInfo>{rtn.memo}</MemoInfo>
              </MainInfoContainer>
            </ItemContainer>

            <NoteButton>
              <Ellipsis width={24} />
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

const MainInfoContainer = styled.div``;

const TitleText = styled.div`
  font-weight: 500;
  font-size: 16px;
`;

const AmountText = styled.div`
  font-size: 14px;
`;

const MainInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  gap: 6px;
  font-size: 14px;
`;

const MemoInfo = styled.div`
  font-size: 14px;
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
`;

const NoteButton = styled.div``;
