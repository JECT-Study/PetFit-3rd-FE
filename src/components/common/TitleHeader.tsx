import type { ReactNode } from 'react';

import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
}

export const TitleHeader = ({ title, showBack, right }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <HeaderBar>
        <Left>
          {showBack && (
            <IconButton aria-label="뒤로가기" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
            </IconButton>
          )}
        </Left>

        <Title>{title}</Title>

        <Right>{right}</Right>
      </HeaderBar>

      <Spacer />
    </>
  );
};

const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  max-width: 600px;
  min-width: 320px;
  margin: 0 auto;
  padding: 0 16px;
  background: #ffffff;
  z-index: 100;
`;

const Title = styled.div`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
`;

const SlotBox = styled.div`
  width: 24px;
  display: flex;
  align-items: center;
`;

const Left = styled(SlotBox)``;
const Right = styled(SlotBox)`
  justify-content: flex-end;
`;

const IconButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
`;

const Spacer = styled.div`
  height: 60px;
`;
