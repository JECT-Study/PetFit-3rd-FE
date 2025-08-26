import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/layouts/MainLayout';
import { PlainLayout } from '@/layouts/PlainLayout';
import { AlarmPage } from '@/pages/AlarmPage';
import { AuthLoginRedirectPage } from '@/pages/AuthLoginRedirectPage';
import { AuthLogoutRedirectPage } from '@/pages/AuthLogoutRedirectPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { MyPage } from '@/pages/MyPage';
import { NicknameEditPage } from '@/pages/NicknameEditPage';
import { PetAddPage } from '@/pages/PetAddPage';
import { PetEditPage } from '@/pages/PetEditPage';
import { PetManagementPage } from '@/pages/PetManagementPage';
import { SignupPetRegisterPage } from '@/pages/SignupPetRegisterPage';
import { SlotSettingPage } from '@/pages/SlotSettingPage';
import { TokenRedirectPage } from '@/pages/TokenRedirectPage';
import { WithdrawPage } from '@/pages/WithdrawPage';

import { PrivateRouter } from './PrivateRouter';
import { StateGuard } from './StateGuard';

export const router = createBrowserRouter([
  {
    element: <PlainLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/oauth/redirect', element: <AuthLoginRedirectPage /> },
      { path: '/auth/kakao/logout/dev', element: <AuthLogoutRedirectPage /> },
      { path: '/token', element: <TokenRedirectPage /> },
    ],
  },
  {
    element: <PrivateRouter />,
    children: [
      // 전역 상태 모두 필요(메인 섹션)
      {
        element: <StateGuard requireMemberId requireSelectedPet />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: '/', element: <HomePage /> },
              { path: '/alarm', element: <AlarmPage /> },
              { path: '/calendar', element: <CalendarPage /> },
              // { path: '/info', element: <InfoPage /> },
              { path: '/mypage', element: <MyPage /> },
              { path: '/withdraw', element: <WithdrawPage /> },
              { path: '/edit-nickname', element: <NicknameEditPage /> },
              { path: '/manage', element: <PetManagementPage /> },
              { path: '/add/pet', element: <PetAddPage /> },
              { path: '/edit/pet/:petId', element: <PetEditPage /> },
            ],
          },
        ],
      },
      // 신규 유저 플로우: memberId만 필요, selectedPetId는 불필요
      {
        element: <StateGuard requireMemberId requireSelectedPet={false} />,
        children: [
          {
            element: <PlainLayout />,
            children: [
              { path: '/signup/pet', element: <SignupPetRegisterPage /> },
              { path: '/slot', element: <SlotSettingPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
