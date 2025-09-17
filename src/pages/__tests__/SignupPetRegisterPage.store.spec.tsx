import { configureStore } from '@reduxjs/toolkit';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import selectedPetReducer from '@/store/petSlice';
import { theme } from '@/styles/theme';

import { SignupPetRegisterPage } from '../SignupPetRegisterPage';

// 🔧 라우팅만 목
vi.mock('react-router-dom', async orig => {
  const m = await orig<typeof import('react-router-dom')>();
  return { ...m, useNavigate: vi.fn() };
});

// 🔧 네트워크 훅만 목(컴포넌트는 성공 응답만 받게)
const registerMock = vi.fn();
let hookLoading = false;
let hookError: string | null = null;
vi.mock('@/hooks/useRegisterPet', () => ({
  useRegisterPet: () => ({ register: registerMock, loading: hookLoading, error: hookError }),
}));

// 🧩 실제 리듀서를 연결(키는 실제 store 구조에 맞춰 수정)

const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      // 예) state.selectedPet.id 로 쓰고 있다면 키 이름은 'selectedPet'이어야 함
      selectedPet: selectedPetReducer,
      // 만약 별도의 selectedPetId 슬라이스가 있다면 여기 추가
      // selectedPetId: selectedPetIdReducer,
    },
  });

  const ui = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <SignupPetRegisterPage />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
  return { store, ...ui };
};

// 슬라이스 모양이 달라도 견고하게 읽는 헬퍼(한 군데만 수정하면 됨)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSelectedPetId(state: any): number | null {
  // 가장 흔한 케이스: selectedPet 슬라이스가 평면 구조
  if (state.selectedPet?.id != null) return state.selectedPet.id;
  // 대안: pet.selectedPetId 형태 등을 쓰고 있다면 여기에 추가
  if (state.pet?.selectedPetId != null) return state.pet.selectedPetId;
  return null;
}

beforeEach(() => {
  vi.clearAllMocks();
  registerMock.mockReset();
  hookLoading = false;
  hookError = null;
});

describe('SignupPetRegisterPage – store 통합(핵심)', () => {
  it('성공 시 store 상태가 갱신되고 라우팅된다', async () => {
    registerMock.mockResolvedValue({
      id: 123,
      name: '댕댕이',
      species: '강아지',
      gender: '남아',
      birthDate: new Date(),
    });

    const mockNavigate = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);

    const { store } = renderWithStore();

    await userEvent.type(screen.getByPlaceholderText(/이름.*입력/i), '댕댕이');
    await userEvent.click(screen.getByRole('button', { name: '다음' }));

    // ✅ store 값 검증: 핵심 키만(내부 구조 결합 최소화)
    const state = store.getState();
    expect(getSelectedPetId(state)).toBe(123);

    // ✅ 라우팅 검증
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/slot?flow=signup');
    });
  });
});
