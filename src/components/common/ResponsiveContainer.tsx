import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

export const ResponsiveContainer = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  position: relative;
  max-width: 600px;
  min-width: 320px;
  margin: 0 auto;
  padding: 0 1rem 60px; // BottomNav 공간 확보
  box-sizing: border-box;
  min-height: 100vh;
  background-color: #fff;

  @media (max-width: 319px) {
    margin: 0; // 중앙정렬 해제
  }
`;
