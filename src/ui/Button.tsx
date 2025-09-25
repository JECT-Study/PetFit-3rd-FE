// src/ui/Button.tsx
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ElementType,
  type MouseEventHandler,
} from 'react';
import styled, { css } from 'styled-components';
import { tx } from '@/styles/typography';

export type ButtonSize = 'lg' | 'sm';
export type ButtonVariant = 'primary' | 'destructive';

// ⬇︎ 커스텀 props 타입 추가
type BaseOwnProps = {
  size?: ButtonSize;
  fullWidth?: boolean;
  variant?: ButtonVariant;
};

/** onClick을 HTMLElement 기준으로 넓혀 Link 합성 시 any 캐스팅 제거 */
type Native = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> & {
  onClick?: MouseEventHandler<HTMLElement>;
};

// ⬇︎ Link 합성/네이티브 버튼 각각에 BaseOwnProps를 믹스인
/** Link 합성만 허용: as는 'button' 또는 to prop을 받는 컴포넌트(react-router Link 등) */
type ButtonAsButton = BaseOwnProps & Native & { as?: 'button'; to?: never };
type ButtonAsLink<C extends ElementType = ElementType> = BaseOwnProps &
  Omit<Native, 'disabled'> & {
    as: C;
    to: string;
    disabled?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { as = 'button', size = 'lg', fullWidth, variant = 'primary', disabled, onClick, to, ...rest },
    ref
  ) => {
    const isButton = as === 'button';

    const handleClick: MouseEventHandler<HTMLElement> = e => {
      if (disabled) {
        // Link 합성 시 라우팅 방지
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    return (
      <Root
        ref={ref}
        as={as as any}
        $size={size}
        $full={fullWidth}
        $variant={variant}
        $disabled={!!disabled}
        // 네이티브 버튼일 때만 네이티브 disabled/ type 설정 (type 고정: 'button')
        type={isButton ? 'button' : undefined}
        disabled={isButton ? disabled : undefined}
        // Link 합성 비활성화 접근성 표시
        aria-disabled={!isButton && disabled ? true : undefined}
        // Link 합성일 때만 to 전달
        {...(!isButton ? { to } : null)}
        onClick={handleClick}
        {...rest}
      />
    );
  }
);
Button.displayName = 'Button';

const Root = styled.button<{
  $size: ButtonSize;
  $full?: boolean;
  $variant: ButtonVariant;
  $disabled?: boolean;
}>`
  /* 레이아웃 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $full }) => ($full ? '100%' : 'auto')};

  /* 터치 반응 최적화 */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  /* 전환 */
  transition:
    background 120ms ease,
    border-color 120ms ease,
    color 120ms ease,
    box-shadow 120ms ease;

  /* size */
  ${({ $size }) =>
    $size === 'lg'
      ? css`
          padding: 20px;
          border-radius: ${({ theme }) => theme.radius.md};
          ${tx.title('semi18')};
        `
      : css`
          padding: 8px 12px;
          border-radius: ${({ theme }) => theme.radius.sm};
          ${tx.body('semi14')};
        `}

  /* 스킨 */
  background: ${({ theme, $variant }) =>
    $variant === 'destructive' ? theme.color.warning[500] : theme.color.main[500]};
  border: ${({ theme, $variant }) =>
    $variant === 'destructive' ? 'none' : `1px solid ${theme.color.main[500]}`};
  color: ${({ theme, $variant }) =>
    $variant === 'destructive' ? theme.color.gray[100] : theme.color.gray[700]};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  /* 데스크탑: hover 시 외곽선 스타일 */
  @media (hover: hover) and (pointer: fine) {
    ${({ $variant, theme }) =>
      $variant !== 'destructive' &&
      css`
        &:hover:not(:disabled):not([aria-disabled='true']) {
          background: ${theme.color.white};
        }
      `}
  }
  /* 모바일/터치: active(누르는 동안) 시 외곽선 스타일 */
  @media (hover: none) and (pointer: coarse) {
    ${({ $variant, theme }) =>
      $variant !== 'destructive' &&
      css`
        &:active:not(:disabled):not([aria-disabled='true']) {
          background: ${theme.color.white};
        }
      `}
  }

  /* disabled (네이티브 + Link 합성) */
  ${({ theme, $disabled }) =>
    $disabled &&
    css`
      background: ${theme.color.gray[100]} !important;
      color: ${theme.color.gray[400]} !important;
      border-color: ${theme.color.gray[300]} !important;
      box-shadow: none !important;
    `}

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.color.main[200]};
  }
`;
