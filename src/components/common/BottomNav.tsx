import { Home, Clock, Calendar, Play, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const BottomNav = () => {
  return (
    <Wrapper>
      <Inner>
        <StyledLink to="/" end>
          {({ isActive }) => (
            <Item $active={isActive}>
              <Home size={20} strokeWidth={2.5} color={isActive ? '#facc15' : '#6b7280'} />
              <span>홈</span>
            </Item>
          )}
        </StyledLink>
        <StyledLink to="/alarm">
          {({ isActive }) => (
            <Item $active={isActive}>
              <Clock size={20} strokeWidth={2.5} color={isActive ? '#facc15' : '#6b7280'} />
              <span>알람</span>
            </Item>
          )}
        </StyledLink>
        <StyledLink to="/calendar">
          {({ isActive }) => (
            <Item $active={isActive}>
              <Calendar size={20} strokeWidth={2.5} color={isActive ? '#facc15' : '#6b7280'} />
              <span>달력</span>
            </Item>
          )}
        </StyledLink>
        <StyledLink to="/info">
          {({ isActive }) => (
            <Item $active={isActive}>
              <Play size={20} strokeWidth={2.5} color={isActive ? '#facc15' : '#6b7280'} />
              <span>정보</span>
            </Item>
          )}
        </StyledLink>
        <StyledLink to="/mypage">
          {({ isActive }) => (
            <Item $active={isActive}>
              <User size={20} strokeWidth={2.5} color={isActive ? '#facc15' : '#6b7280'} />
              <span>마이페이지</span>
            </Item>
          )}
        </StyledLink>
      </Inner>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 10;
`;

const Inner = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 600px;
  min-width: 320px;
  margin: 0 auto;
  padding: 12px 16px 0;
  height: 100%;
  background-color: white;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 319px) {
    margin: 0; // 중앙정렬 해제
  }
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  flex: 1;
  text-align: center;
`;

const Item = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: ${({ $active }) => ($active ? '#facc15' : '#6b7280')};
`;
