// src/ds/Modal.tsx
import { useClickOutside } from '@/hooks/useClickOutside';
import { tx } from '@/styles/typography';
import { X } from 'lucide-react';
import { forwardRef, useEffect, useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

function trapTab(e: React.KeyboardEvent, container: HTMLElement) {
  if (e.key !== 'Tab') return;
  const focusables = container.querySelectorAll<HTMLElement>(
    [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')
  );
  if (focusables.length === 0) {
    // 포커서블 없으면 Dialog 자체가 포커스를 가져야 하므로
    e.preventDefault();
    (container as HTMLElement).focus();
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  const active = document.activeElement as HTMLElement | null;
  if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && (active === first || !active)) {
    e.preventDefault();
    last.focus();
  }
}

type AnyRef<T> =
  | { readonly current: T | null } // createRef()의 RefObject<T>
  | { current: T | null }; // useRef()의 MutableRefObject<T>

export interface ModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  // 포커스/접근성
  initialFocusRef?: AnyRef<HTMLElement>;
  labelledBy?: string; // 사용처에서 <h2 id=...>
  describedBy?: string; // 사용처에서 <p id=...>

  // 레이아웃/사이즈
  size?: 'lg' | 'sm';

  // 헤더/푸터(있으면 자동 배치)
  title?: React.ReactNode;
  showClose?: boolean; // 기본 true
  footer?: React.ReactNode;

  children?: ReactNode; // 사용처가 자유롭게 구성(필드 등)
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onOpenChange,
    initialFocusRef,
    labelledBy,
    describedBy,
    size = 'lg',
    title,
    showClose = true,
    footer,
    children,
  },
  ref
) {
  const contentRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<Element | null>(null);
  const headerId = useId();

  // 외부 ref 병합
  useLayoutEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') ref(contentRef.current!);
    else (ref as React.RefObject<HTMLDivElement | null>).current = contentRef.current;
  }, [ref]);

  // 문서 레벨 바깥 클릭 감지 → 닫기
  useClickOutside(contentRef, open, () => onOpenChange(false));

  // 스크롤락 + 초기 포커스 + 복원
  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow; // (선택) iOS 사파리 보강
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const t = window.setTimeout(() => {
      const container = contentRef.current;
      if (!container) return;

      const target =
        initialFocusRef?.current ??
        container.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ??
        container; // 폴백: Dialog 자체

      target?.focus?.();
    }, 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow; // (선택) iOS 보강 복원
      (lastActiveRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open, initialFocusRef]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <Overlay>
      <Dialog
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? (title ? headerId : undefined)}
        aria-describedby={describedBy}
        $size={size}
        tabIndex={-1} // 포커스 폴백을 위해 필요
        onKeyDown={e => contentRef.current && trapTab(e, contentRef.current)}
      >
        {title != null || footer != null || showClose ? (
          <Frame>
            {(title != null || showClose) && (
              <Header>
                {/* 왼쪽 빈영역(1fr) */}
                <div aria-hidden />
                {/* 중앙 제목 */}
                {title != null && (
                  <Title id={headerId} $size={size}>
                    {title}
                  </Title>
                )}
                {/* 오른쪽 닫기 버튼 */}
                {showClose ? (
                  <IconBtn aria-label="닫기" onClick={() => onOpenChange(false)}>
                    <X size={24} />
                  </IconBtn>
                ) : (
                  <div aria-hidden />
                )}
              </Header>
            )}
            <Body>{children}</Body>
            {/* sm: 두 버튼 가로 정렬을 위해 flex 래퍼 / lg: 래퍼 없이 그대로 렌더 */}
            {footer != null && (size === 'sm' ? <FooterRow>{footer}</FooterRow> : footer)}
          </Frame>
        ) : (
          // 완전 자유 레이아웃도 허용
          children
        )}
      </Dialog>
    </Overlay>,
    document.body
  );
});

/* styled */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;

  background: #4a4a4acc;

  animation: fadeIn 120ms ease-out;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Dialog = styled.div<{ $size: 'lg' | 'sm' }>`
  width: min(90vw, 335px);
  max-height: 84vh;
  overflow-y: auto;

  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.gray[700]};

  /* size */
  padding: ${({ $size }) => ($size === 'lg' ? '12px' : '20px')};
  border-radius: ${({ theme, $size }) => ($size === 'lg' ? theme.radius.lg : theme.radius.md)};

  animation: pop 140ms ease-out;
  @keyframes pop {
    from {
      transform: translateY(6px) scale(0.98);
      opacity: 0.8;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
`;

/* ✔️ 항상 중앙 타이틀을 보장하는 3열 그리드 */
const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
`;

const Title = styled.h2<{ $size: 'lg' | 'sm' }>`
  grid-column: 2;
  ${({ $size, theme }) =>
    $size === 'sm'
      ? css`
          color: ${theme.color.black};
          ${tx.title('semi18')};
        `
      : css`
          color: #434343;
          font-family: Pretendard;
          font-size: 18px;
          font-style: normal;
          font-weight: 700;
          line-height: 140%; /* 25.2px */
          letter-spacing: -0.45px;
        `}
`;

const IconBtn = styled.button`
  display: inline-flex;
  justify-content: end;
  align-items: center;
  color: ${({ theme }) => theme.color.gray[700]};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FooterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;
