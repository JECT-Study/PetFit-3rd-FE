import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, fn } from '@storybook/test';
import { ToastView, ToastAnchor } from './Toast';

const meta: Meta<typeof ToastView> = {
  title: 'DS/ToastView',
  component: ToastView,
  args: {
    // 기본값: alert 케이스로 렌더; 각 스토리에서 덮어씌움
    variant: 'alert',
    time: '11:00',
    content: '동물병원 가기',
  },
  decorators: [
    (Story, ctx) => (
      <ToastAnchor
        $variant={ctx.args.variant}
        role={ctx.args.variant === 'alert' ? 'status' : 'alert'}
        aria-live={ctx.args.variant === 'alert' ? 'polite' : 'assertive'}
        aria-label={ctx.args.variant === 'alert' ? 'Alerts' : 'Errors'}
      >
        <Story />
      </ToastAnchor>
    ),
  ],
  parameters: { layout: 'fullscreen', docs: { story: { inline: false } } },
  tags: ['autodocs'],
};
export default meta;
type S = StoryObj<typeof ToastView>;

export const Alert: S = {
  args: {
    variant: 'alert',
    time: '11:00',
    content: '동물병원 가기',
    onConfirm: fn(),
    onClose: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const btn = await c.findByRole('button', { name: '확인' });
    await userEvent.click(btn);
    await expect(args.onConfirm).toHaveBeenCalled();
    await expect(args.onClose).toHaveBeenCalled();
  },
};

export const Error: S = {
  args: {
    variant: 'error',
    content: '과거의 날짜는 선택할 수 없습니다.',
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // 에러 토스트엔 확인 버튼이 없다
    await expect(c.queryByRole('button', { name: '확인' })).toBeNull();
  },
};
