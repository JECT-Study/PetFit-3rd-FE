import styled from 'styled-components';

export const TodayBar = () => {
  const today = new Date();
  const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(
    today.getDate()
  ).padStart(2, '0')}일`;

  // 기준일: 2023-01-01
  const startDate = new Date('2023-01-01');
  const diff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const dDay = `D+ ${diff}`;

  return (
    <Wrapper>
      <TodayText>
        <strong>Today</strong> {formattedDate}
      </TodayText>
      <DDayText>{dDay}</DDayText>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const TodayText = styled.span`
  font-size: 14px;
  color: #333;

  strong {
    margin-right: 4px;
    font-weight: 600;
  }
`;

const DDayText = styled.span`
  font-size: 14px;
  color: #555;
`;
