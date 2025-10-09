// src/ds/Modal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, expect, screen, waitFor } from '@storybook/test';
import { useRef, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

const meta: Meta<typeof Modal> = {
  title: 'DS/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    controls: { exclude: ['open', 'onOpenChange', 'initialFocusRef'] },
  },
};
export default meta;

type S = StoryObj<typeof Modal>;

/**
 * ✅ Basic: 라벨/설명 연결(aria-labelledby/aria-describedby) + 닫기 버튼으로 종료
 * 포털로 body에 렌더되므로 screen을 사용해 조회합니다.
 */
export const Basic: S = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>열기</Button>
        <Modal open={open} onOpenChange={setOpen} labelledBy="m-title" describedBy="m-desc">
          <div style={{ padding: 16 }}>
            <h2 id="m-title" style={{ marginTop: 0 }}>
              확인이 필요합니다
            </h2>
            <p id="m-desc">아래 버튼으로 모달을 닫을 수 있습니다.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={() => setOpen(false)}>닫기</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
  play: async () => {
    await userEvent.click(await screen.findByRole('button', { name: '열기' }));
    const dialog = await screen.findByRole('dialog');
    await expect(dialog).toBeInTheDocument();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby', 'm-title');
    await expect(dialog).toHaveAttribute('aria-describedby', 'm-desc');

    await userEvent.click(await screen.findByRole('button', { name: '닫기' }));
    // 닫힌 뒤에는 다이얼로그가 없어야 함
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

/**
 * ✅ InitialFocus: initialFocusRef로 초점 제어
 */
export const InitialFocus: S = {
  render: () => {
    const [open, setOpen] = useState(false);
    const confirmRef = useRef<HTMLButtonElement>(null);
    return (
      <>
        <Button onClick={() => setOpen(true)}>열기</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          labelledBy="focus-title"
          initialFocusRef={confirmRef}
        >
          <div style={{ padding: 16 }}>
            <h2 id="focus-title" style={{ marginTop: 0 }}>
              초점 테스트
            </h2>
            <input placeholder="이름" />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button onClick={() => setOpen(false)}>취소</Button>
              <Button ref={confirmRef} variant="primary" onClick={() => setOpen(false)}>
                확인
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
  play: async () => {
    await userEvent.click(await screen.findByRole('button', { name: '열기' }));
    const confirmBtn = await screen.findByRole('button', { name: '확인' });
    await waitFor(() => expect(confirmBtn).toHaveFocus()); // ✅ initialFocusRef 동작 확인
  },
};

/**
 * ✅ EscClose: ESC 키로 닫힘(closeOnEsc 기본값 true)
 */
export const EscClose: S = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>열기</Button>
        <Modal open={open} onOpenChange={setOpen} labelledBy="esc-title">
          <div style={{ padding: 16 }}>
            <h2 id="esc-title" style={{ marginTop: 0 }}>
              ESC로 닫기
            </h2>
            <p>ESC 키를 누르면 닫힙니다.</p>
          </div>
        </Modal>
      </>
    );
  },
  play: async () => {
    await userEvent.click(await screen.findByRole('button', { name: '열기' }));
    await expect(await screen.findByRole('dialog')).toBeInTheDocument();

    // ESC 입력
    await userEvent.keyboard('{Escape}');
    await expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
