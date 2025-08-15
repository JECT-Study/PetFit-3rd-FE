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
import { SignupPetRegisterPage } from '@/pages/SignupPetRegisterPage';
import { SlotSettingPage } from '@/pages/SlotSettingPage';
import { TokenRedirectPage } from '@/pages/TokenRedirectPage';
import { WithdrawPage } from '@/pages/WithdrawPage';

import { PrivateRouter } from './PrivateRouter';

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
        ],
      },
      {
        element: <PlainLayout />,

        children: [
          { path: '/signup/pet', element: <SignupPetRegisterPage /> },
          { path: '/slot', element: <SlotSettingPage /> },
        ],
      },
    ],
  },
]);
