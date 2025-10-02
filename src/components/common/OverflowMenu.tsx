import { useState, useRef } from 'react';

import { MoreVertical } from 'lucide-react';
import styled from 'styled-components';
import { tx } from '@/styles/typography';
import { useClickOutside } from '@/hooks/useClickOutside';

interface OverflowMenuProps {
  onEdit?: () => void;
  onDelete: () => void;
}

export const OverflowMenu = ({ onEdit, onDelete }: OverflowMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, isOpen, () => setIsOpen(false));

  const handleToggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <Wrapper ref={dropdownRef}>
      <ToggleButton
        onClick={handleToggleDropdown}
        aria-label="더보기"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <MoreIcon />
      </ToggleButton>

      {isOpen && (
        <Dropdown>
          {onEdit && <DropdownItem onClick={onEdit}>수정</DropdownItem>}
          <DropdownItem onClick={onDelete}>삭제</DropdownItem>
        </Dropdown>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const ToggleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MoreIcon = styled(MoreVertical).attrs({ size: 24, strokeWidth: 2 })`
  color: ${({ theme }) => theme.color.gray[400]};
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 24px;
  right: 0;
  padding: 2px 0;
  width: 80px;
  background: ${({ theme }) => theme.color.white};
  border-radius: 4px;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 11;
`;

const DropdownItem = styled.li`
  padding: 4px 8px;
  text-align: right;
  ${tx.body('med13')};
  color: ${({ theme }) => theme.color.gray[700]};
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;
