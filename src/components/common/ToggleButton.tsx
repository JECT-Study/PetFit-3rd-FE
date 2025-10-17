import { useState } from 'react';

import styled from 'styled-components';

interface ToggleButtonProps {
  onToggle: (isOn: boolean) => void;
}

export const ToggleButton = ({ onToggle }: ToggleButtonProps) => {
  const [isToggleOn, setIsToggleOn] = useState(true);

  const handleClick = () => {
    const newState = !isToggleOn;
    setIsToggleOn(newState);
    onToggle(newState);
  };
  return (
    <ToggleWrap onClick={handleClick}>
      <ToggleBackground $isToggleOn={isToggleOn}>
        <HandleButton $isToggleOn={isToggleOn}></HandleButton>
      </ToggleBackground>
    </ToggleWrap>
  );
};

const ToggleWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ToggleBackground = styled.div<{ $isToggleOn: boolean }>`
  transition: all 0.3s;
  position: relative;
  width: 34px;
  height: 18px;
  border-radius: 16px;
  outline: none;
  padding: 0 2px;
  background-color: ${({ theme, $isToggleOn }) =>
    $isToggleOn ? theme.color.main[500] : theme.color.gray[400]};
`;

const HandleButton = styled.div<{ $isToggleOn: boolean }>`
  transition: all 0.3s;
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 16px;
  margin-top: 2px;
  background-color: white;
  transform: ${({ $isToggleOn }) => ($isToggleOn ? 'translateX(16px)' : 'translateX(0px)')};
`;
