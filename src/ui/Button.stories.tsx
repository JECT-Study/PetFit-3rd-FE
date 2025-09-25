// src/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { Link } from 'react-router-dom';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'DS/Button',
  component: Button,
  args: {
    children: '버튼',
    size: 'lg',
    fullWidth: false,
    variant: 'primary',
    disabled: false,
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['lg', 'sm'],
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'destructive'],
    },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
};
export default meta;

type S = StoryObj<typeof Button>;

export const Default: S = {};

export const Small: S = {
  args: { size: 'sm', children: '작은 버튼' },
};

export const FullWidth: S = {
  args: { fullWidth: true, children: '가로 100% 버튼' },
};

export const Destructive: S = {
  args: { variant: 'destructive', children: '삭제 버튼' },
};

export const Disabled: S = {
  args: { disabled: true, onClick: fn(), children: '버튼' },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const btn = await c.findByRole('button', { name: '버튼' });
    await expect(btn).toBeDisabled(); // 네이티브 disabled
    await userEvent.click(btn);
    await expect(args.onClick).not.toHaveBeenCalled(); // 클릭 무시
  },
};

export const AsLink: S = {
  args: { as: Link, to: '/next', children: '링크', onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const link = await c.findByRole('link', { name: '링크' });
    // 비활성 아님 → onClick 호출
    await userEvent.click(link);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const AsLinkDisabled: S = {
  args: { as: Link, to: '/next', children: '링크', disabled: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const link = await c.findByRole('link', { name: '링크' });
    // 접근성 상태 확인(aria-disabled 설정)
    await expect(link).toHaveAttribute('aria-disabled', 'true');
    // 클릭해도 라우팅/핸들러 동작 금지 (preventDefault)
    await userEvent.click(link);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
