// src/ui/InputBase.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { InputBase } from './InputBase';

const meta: Meta<typeof InputBase> = {
  title: 'DS/InputBase',
  component: InputBase,
  args: { placeholder: '입력하세요' },
};
export default meta;

type S = StoryObj<typeof InputBase>;

export const Default: S = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const input = c.getByPlaceholderText('입력하세요') as HTMLInputElement;
    await userEvent.type(input, 'abc');
    await expect(input.value).toBe('abc');
  },
};

// ✅ 커스텀 prop `invalid` 제거, 접근성 속성만 사용
export const Invalid: S = {
  args: { 'aria-invalid': true },
};

export const ReadOnly: S = {
  args: { readOnly: true, defaultValue: 'read-only' },
};
