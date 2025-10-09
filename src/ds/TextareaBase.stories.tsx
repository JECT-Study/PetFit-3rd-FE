// src/ds/TextareaBase.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TextareaBase } from './TextareaBase';

const meta: Meta<typeof TextareaBase> = {
  title: 'DS/TextareaBase',
  component: TextareaBase,
  args: { placeholder: '내용을 입력하세요' },
};
export default meta;

type S = StoryObj<typeof TextareaBase>;

export const Default: S = {};

export const Invalid: S = {
  // ✅ 커스텀 prop `invalid` 제거, 접근성 속성만 사용
  args: { 'aria-invalid': true },
};
