import { useState, useRef, useEffect } from 'react';

import { MoreHorizontal } from 'lucide-react';
import styled from 'styled-components';

interface MoreActionDropdownProps {
  onEdit?: () => void;
  onDelete: () => void;
}

export const MoreActionDropdown = ({ onEdit, onDelete }: MoreActionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Wrapper ref={dropdownRef}>
      <ToggleButton onClick={toggleDropdown}>
        <MoreHorizontal size={20} />
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
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 24px;
  right: 0;
  width: 80px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 4px 0;
  z-index: 10;
`;

const DropdownItem = styled.li`
  padding: 8px 12px;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;
