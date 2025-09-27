import styled, { keyframes } from 'styled-components';
import { AlertCircle, Bell } from 'lucide-react';
import { tx } from '@/styles/typography';

export type ToastVariant = 'error' | 'alert';

type AlertToastProps = {
  variant: 'alert';
  time: string; // 예: "11:00"
  content: string; // 예: "동물병원 가기"
  onConfirm?: () => void; // 확인 버튼 콜백
  onClose?: () => void; // 확인 후 닫기 트리거
};

type ErrorToastProps = {
  variant: 'error';
  content: string; // 예: "과거의 날짜는 선택할 수 없습니다."
  onConfirm?: never;
  onClose?: never;
};

export type ToastViewProps = AlertToastProps | ErrorToastProps;

/** 상/하단 배치 래퍼 */
export const ToastAnchor = styled.div<{ $variant: ToastVariant }>`
  position: fixed;
  left: 0;
  right: 0;
  ${({ $variant }) => ($variant === 'alert' ? 'top: 20px;' : 'bottom: 20px;')}
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 3000;
`;

export const ToastView = ({ variant, content, ...rest }: ToastViewProps) => {
  if (variant === 'alert' && 'time' in rest) {
    const { time, onConfirm, onClose } = rest;
    return (
      <Card $variant="alert">
        <Left>
          <Icon $variant="alert" aria-hidden>
            <Bell size={20} />
          </Icon>
          <Message>
            <Time aria-hidden>{time}</Time>
            <Text $variant="alert">{content}</Text>
          </Message>
        </Left>

        <ActionButton
          type="button"
          onClick={() => {
            onConfirm?.();
            onClose?.();
          }}
        >
          확인
        </ActionButton>
      </Card>
    );
  }

  // variant === 'error'
  return (
    <Card $variant="error">
      <Left>
        <Icon $variant="error" aria-hidden>
          <AlertCircle size={20} />
        </Icon>
        <Text $variant="error">{content}</Text>
      </Left>
      {/* error는 버튼 없음 */}
    </Card>
  );
};

/* ===== styles ===== */
const enter = keyframes`
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);  opacity: 1; }
`;

const Card = styled.div<{ $variant: ToastVariant }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  width: min(720px, calc(100% - 32px));
  padding: 16px 20px;

  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(55, 55, 55, 0.8);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);

  /* 텍스트는 모두 이 색을 상속 */
  color: ${({ theme }) => theme.color.white};

  pointer-events: auto;
  animation: ${enter} 140ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const Icon = styled.span<{ $variant: ToastVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $variant }) =>
    $variant === 'error' ? theme.color.warning[500] : theme.color.main[500]};
`;

const Message = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0; /* flex 수축 허용 */
`;

const Time = styled.span`
  ${tx.body('semi14')};
  color: inherit;
  flex: none;
  white-space: nowrap;
`;

const Text = styled.span<{ $variant: ToastVariant }>`
  ${({ $variant }) => ($variant === 'error' ? tx.body('semi14') : tx.body('reg14'))};
  color: inherit;
  flex: 1 1 auto;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActionButton = styled.button`
  flex-shrink: 0;
  padding: 5px 10px;
  min-height: 28px; /* 터치 목표 최소 확보 */
  border-radius: 50px;
  border: none;
  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.gray[500]};
  ${tx.body('semi13')};
  cursor: pointer;

  &:focus-visible {
    outline: auto;
  }
`;
