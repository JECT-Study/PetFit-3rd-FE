import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import { theme } from '../../styles/theme';
import { SignupPetRegisterPage } from '../SignupPetRegisterPage';

// navigate 모킹
vi.mock('react-router-dom', async orig => {
  const m = await orig<typeof import('react-router-dom')>();
  return { ...m, useNavigate: vi.fn() };
});

vi.mock('react-redux', () => ({ useDispatch: vi.fn() }));

// 훅 모킹을 위한 핸들들
const registerMock = vi.fn();
let hookLoading = false;
let hookError: string | null = null;
vi.mock('@/hooks/useRegisterPet', () => ({
  useRegisterPet: () => ({
    register: registerMock,
    loading: hookLoading,
    error: hookError,
  }),
}));

const renderPage = () =>
  render(
    <ThemeProvider theme={theme}>
      <SignupPetRegisterPage />
    </ThemeProvider>
  );

beforeEach(() => {
  vi.clearAllMocks();
  registerMock.mockReset();
  hookLoading = false;
  hookError = null;

  // ✅ useDispatch가 함수(디스패치 함수) 를 반환하도록 보장
  (useDispatch as unknown as Mock).mockReturnValue(vi.fn());
});

describe('SignupPetRegisterPage – behavior', () => {
  it('초기 [다음] 비활성화 → 이름 입력 시 활성화', async () => {
    renderPage();
    const next = screen.getByRole('button', { name: /다음|등록 중/i });
    expect(next).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText(/이름.*입력/i), '댕댕이');
    expect(next).toBeEnabled();
  });

  it('로딩 중: 버튼 비활성 + 라벨 "등록 중..."', () => {
    hookLoading = true;
    renderPage();
    const next = screen.getByRole('button', { name: /등록 중/i });
    expect(next).toBeDisabled();
  });

  it('성공: register 호출 후 /slot?flow=signup 이동', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);

    registerMock.mockResolvedValue({
      id: 123,
      name: '댕댕이',
      species: '강아지',
      gender: '남아',
      birthDate: new Date(),
    });

    renderPage();
    await userEvent.type(screen.getByPlaceholderText(/이름.*입력/i), '댕댕이');
    await userEvent.click(screen.getByRole('button', { name: '다음' }));

    expect(registerMock).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/slot?flow=signup');
  });

  it('실패: register가 null + 훅 error 존재 → 에러 메시지 노출 + alert 호출', async () => {
    registerMock.mockResolvedValue(null);
    hookError = '등록 실패';
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderPage();
    await userEvent.type(screen.getByPlaceholderText(/이름.*입력/i), '댕댕이');
    await userEvent.click(screen.getByRole('button', { name: /다음/i }));

    // 화면 배너/문구 확인 (현재 구현은 Title 아래 ErrorMessage)
    expect(screen.getByText('등록 실패')).toBeInTheDocument();
    // alert 호출 확인 (현재 구현 경로)
    expect(alertSpy).toHaveBeenCalledWith('등록 실패');

    alertSpy.mockRestore();
  });
});
