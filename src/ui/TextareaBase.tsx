// src/ui/TextareaBase.tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import styled from 'styled-components';
import { tx } from '@/styles/typography';

export type TextareaBaseProps = ComponentPropsWithoutRef<'textarea'>;

export const TextareaBase = forwardRef<HTMLTextAreaElement, TextareaBaseProps>((props, ref) => (
  <Root ref={ref} {...props} />
));

TextareaBase.displayName = 'TextareaBase';

const Root = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 20px;
  border-radius: 16px;
  resize: vertical; /* 사용자가 높이 조절 가능 */
  ${tx.body('reg14')}

  &::placeholder {
    color: ${({ theme }) => theme.color.gray[400]};
  }

  /* === default / filled === */
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray[300]};
  color: ${({ theme }) => theme.color.gray[700]};

  /* === hover === */
  &:hover {
    border-color: ${({ theme }) => theme.color.main[500]};
  }

  /* 작성 중 */
  &:focus,
  &:focus-visible {
    border-color: ${({ theme }) => theme.color.main[500]};
    outline: none;
  }

  /* === error === */
  &[aria-invalid='true'],
  &[aria-invalid='true']:hover,
  &[aria-invalid='true']:focus,
  &[aria-invalid='true']:focus-visible {
    border-color: ${({ theme }) => theme.color.warning[500]};
  }
`;
