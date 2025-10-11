import { useState, useRef } from 'react';

import { MoreHorizontal, MoreVertical } from 'lucide-react';
import styled from 'styled-components';
import { tx } from '@/styles/typography';
import { useClickOutside } from '@/hooks/useClickOutside';

type MenuContext = 'alarm' | 'calendar';

interface OverflowMenuProps {
  context: MenuContext; // 'alarm' | 'calendar'
  targetDate?: Date; // 알람일 때만 사용(과거이면 수정 숨김)
  onEdit?: () => void;
  onDelete: () => void;
}

export const OverflowMenu = ({ context, targetDate, onEdit, onDelete }: OverflowMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, isOpen, () => setIsOpen(false));

  // 알람 컨텍스트에서는 과거면 수정 숨김
  const canEdit = context === 'alarm' ? !(targetDate && targetDate.getTime() <= Date.now()) : true;

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
        {context === 'alarm' ? <AlarmIcon /> : <CalendarIcon />}
      </ToggleButton>

      {isOpen && (
        <Dropdown role="menu">
          {canEdit && onEdit && (
            <DropdownItem role="menuitem" onClick={onEdit}>
              수정
            </DropdownItem>
          )}
          <DropdownItem role="menuitem" onClick={onDelete}>
            삭제
          </DropdownItem>
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

/* alarm용: 가로 점, 회색700 */
const AlarmIcon = styled(MoreHorizontal).attrs({ size: 24, strokeWidth: 1.5 })`
  color: ${({ theme }) => theme.color.gray[700]};
`;
/* calendar용: 세로 점, 회색400 */
const CalendarIcon = styled(MoreVertical).attrs({ size: 24, strokeWidth: 2 })`
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

  /* 두 번째 항목부터 상단 보더 */
  & + & {
    border-top: 1px solid ${({ theme }) => theme.color.gray[200]};
  }

  &:hover {
    background-color: #f9f9f9;
  }
`;
