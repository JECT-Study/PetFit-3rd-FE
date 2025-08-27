import { useRef, useState } from 'react';

import styled from 'styled-components';

type Props = {
  onExpandToMonth: () => void;
  threshold?: number;
  onDragChange?: (dy: number, isDragging: boolean, progress: number) => void; // ⬅️ 추가
};

export const DragSwitchHandle = ({ onExpandToMonth, threshold = 80, onDragChange }: Props) => {
  const startY = useRef<number | null>(null);
  const [deltaY, setDeltaY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startY.current = e.clientY;
    setDragging(true);
    onDragChange?.(0, true, 0);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || startY.current == null) return;
    const dy = Math.max(0, e.clientY - startY.current); // 아래 방향
    setDeltaY(dy);
    onDragChange?.(dy, true, Math.min(1, dy / threshold));
  };

  const onPointerUp = () => {
    if (deltaY >= threshold) {
      onDragChange?.(deltaY, false, 1);
      onExpandToMonth(); // 전환
    } else {
      onDragChange?.(0, false, 0); // 원위치로 복원
    }
    startY.current = null;
    setDeltaY(0);
    setDragging(false);
  };

  return (
    <Bar onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <Grip />
    </Bar>
  );
};

const Bar = styled.div`
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: none; /* 스크롤 대신 제스처 */
  background: #e0e0e0;
  border-radius: 8px;
  margin: 8px 0 0;
  cursor: ns-resize;
`;
const Grip = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 999px;
  background: #c7c7c7;
`;
