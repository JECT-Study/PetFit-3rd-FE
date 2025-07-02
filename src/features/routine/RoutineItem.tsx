import { Ellipsis, Check } from 'lucide-react';
import styled from 'styled-components';

import meal from '@/assets/icons/meal.svg';

export const RoutineItem = () => {
  const SLOT_ITEMS = [
    {
      id: 'meal',
      label: '사료',
      icon: meal,
      unit: 'g',
      placeholder: '정해진 하루 사료의 양을 입력해주세요.',
    },
  ];
  return (
    <div>
      {SLOT_ITEMS.map(({ id, label, icon, unit }) => (
        <Container key={id}>
          <ItemContainer>
            <Check />

            <MainInfoContainer>
              <MainInfo>
                <img src={icon} />
                <TitleText>{label}</TitleText>
                <AmountText>
                  0 {unit} / 150 {unit}
                </AmountText>
              </MainInfo>

              <MemoInfo>메모메모메모메모메모메모</MemoInfo>
            </MainInfoContainer>
          </ItemContainer>

          <NoteButton>
            <Ellipsis />
          </NoteButton>
        </Container>
      ))}
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
