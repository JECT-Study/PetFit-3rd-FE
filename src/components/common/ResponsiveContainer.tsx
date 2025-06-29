import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  withBottomNav?: boolean;
}

const BOTTOM_NAV_HEIGHT = 60;

export const ResponsiveContainer = ({ children, withBottomNav = false }: Props) => {
  return <Container $withBottomNav={withBottomNav}>{children}</Container>;
};

const Container = styled.div<{ $withBottomNav: boolean }>`
  position: relative;
  max-width: 600px;
  min-width: 320px;
  margin: 0 auto;
  padding-bottom: ${({ $withBottomNav }) =>
    $withBottomNav ? `${BOTTOM_NAV_HEIGHT}px` : '0'}; // BottomNav 공간 확보
  box-sizing: border-box;
  min-height: 100vh;
  background-color: #fff;

  @media (max-width: 319px) {
    margin: 0; // 중앙정렬 해제
  }
`;
