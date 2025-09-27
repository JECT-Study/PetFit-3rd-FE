// src/ds/InputBase.tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import styled from 'styled-components';

import { tx } from '@/styles/typography';

export type InputBaseProps = ComponentPropsWithoutRef<'input'>;

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>((props, ref) => (
  <Root ref={ref} {...props} />
));
InputBase.displayName = 'InputBase';

const Root = styled.input`
  width: 100%;
  padding: 12px 20px;
  border-radius: 8px;
  ${tx.body('reg14')};

  &::placeholder {
    color: ${({ theme }) => theme.color.gray[400]};
  }

  /* === default / filled === */
  color: ${({ theme }) => theme.color.gray[700]};
  border: 1px solid ${({ theme }) => theme.color.gray[300]};
  background: ${({ theme }) => theme.color.white};

  /* === hover (only 활성 상태일 때) === */
  &:hover:not(:disabled):not(:read-only):not([aria-invalid='true']) {
    border-color: ${({ theme }) => theme.color.main[500]};
  }

  /* === 작성 중 === */
  &:focus,
  &:focus-visible {
    border-color: ${({ theme }) => theme.color.main[500]};
    outline: none;
  }

  /* === readOnly === */
  &:read-only {
    border-color: ${({ theme }) => theme.color.gray[200]};
    background: ${({ theme }) => theme.color.gray[100]};
    color: ${({ theme }) => theme.color.gray[600]};
    cursor: default;
  }

  /* === error === */
  &[aria-invalid='true'],
  &[aria-invalid='true']:hover,
  &[aria-invalid='true']:focus,
  &[aria-invalid='true']:focus-visible {
    border-color: ${({ theme }) => theme.color.warning[500]};
  }
`;

export default InputBase;
