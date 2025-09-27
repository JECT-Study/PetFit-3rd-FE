// src/ds/Modal.tsx
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

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
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  initialFocusRef?: AnyRef<HTMLElement>;
  labelledBy?: string; // 사용처에서 <h2 id=...>
  describedBy?: string; // 사용처에서 <p id=...>
  width?: number | string;
  children: ReactNode; // 사용처가 자유롭게 구성(필드, 버튼 등)
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onOpenChange,
    closeOnEsc = true,
    closeOnBackdrop = true,
    initialFocusRef,
    labelledBy,
    describedBy,
    width = 480,
    children,
  },
  ref
) {
  const contentRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<Element | null>(null);

  // 외부 ref 병합
  useLayoutEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') ref(contentRef.current!);
    else (ref as React.RefObject<HTMLDivElement | null>).current = contentRef.current;
  }, [ref]);

  // 스크롤락 + 초기 포커스 + 복원
  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;

    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const prevHtmlOverflow = document.documentElement.style.overflow; // (선택) iOS 사파리 보강
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
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeOnEsc, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <Overlay
      onMouseDown={e => {
        if (!closeOnBackdrop) return;
        if (e.target === e.currentTarget) onOpenChange(false); // 바깥 클릭
      }}
    >
      <Dialog
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        $width={typeof width === 'number' ? `${width}px` : width}
        tabIndex={-1} // 포커스 폴백을 위해 필요
        onKeyDown={e => contentRef.current && trapTab(e, contentRef.current)}
        data-state="open"
      >
        {children}
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
  background: rgba(0, 0, 0, 0.35);
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

const Dialog = styled.div<{ $width: string }>`
  width: min(90vw, ${({ $width }) => $width});
  max-height: 84vh;
  overflow: auto;

  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.gray[700]};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  padding: 20px;

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
