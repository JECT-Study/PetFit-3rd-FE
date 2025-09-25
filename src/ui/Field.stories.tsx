// src/ui/Field.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { useState } from 'react';

import { Field } from './Field';
import { InputBase } from './InputBase';
import { TextareaBase } from './TextareaBase';

const meta: Meta<typeof Field> = {
  title: 'DS/Field',
  component: Field,
  args: {
    // ✅ 공통 기본값: Input(이름)
    label: '이름',
    labelFor: 'name',
    helperId: 'name-help',
    hint: null,
    invalid: false,
    count: 0,
    max: 20,
    showHelper: true,
    children: <InputBase id="name" placeholder="이름을 입력하세요" />,
  },
};
export default meta;

type S = StoryObj<typeof Field>;

/* =========================
 * Input 케이스
 * ========================= */
export const Input_Default: S = {};

export const Input_Invalid: S = {
  args: {
    hint: '이름을 입력해주세요.',
    invalid: true,
  },
};

/** 컨트롤드 예시: value.length로 count 계산 */
export const Input_Controlled: S = {
  render: args => {
    const [val, setVal] = useState('');
    const count = val.length;

    return (
      <Field
        {...args}
        label="이름"
        labelFor="name"
        helperId="name-help"
        hint={count === 0 ? '이름은 필수입니다.' : null}
        invalid={count === 0}
        count={count}
        max={20}
      >
        <InputBase
          id="name"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="이름을 입력하세요"
        />
      </Field>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const input = c.getByPlaceholderText('이름을 입력하세요') as HTMLInputElement;
    await userEvent.type(input, '댕댕이');
    await expect(input.value).toBe('댕댕이');
  },
};

/** 헬퍼(힌트/카운트) 숨김 */
export const Input_NoHelper: S = {
  args: {
    showHelper: false,
  },
};

/* =========================
 * Textarea 케이스
 * ========================= */
export const Textarea_Default: S = {
  args: {
    label: '내용',
    labelFor: 'content',
    helperId: 'content-help',
    hint: null,
    invalid: false,
    count: 0,
    max: 200,
    children: <TextareaBase id="content" placeholder="내용을 입력하세요" />,
  },
};

export const Textarea_Invalid: S = {
  args: {
    label: '내용',
    labelFor: 'content',
    helperId: 'content-help',
    hint: '내용은 최소 1자 이상 입력해주세요.',
    invalid: true,
    count: 0,
    max: 200,
    children: <TextareaBase id="content" placeholder="내용을 입력하세요" />,
  },
};

/** 컨트롤드 Textarea */
export const Textarea_Controlled: S = {
  render: args => {
    const [val, setVal] = useState('');
    const count = val.length;

    return (
      <Field
        {...args}
        label="내용"
        labelFor="content"
        helperId="content-help"
        hint={count === 0 ? '내용을 입력해주세요.' : null}
        invalid={count === 0}
        count={count}
        max={200}
      >
        <TextareaBase
          id="content"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="내용을 입력하세요"
        />
      </Field>
    );
  },
};
