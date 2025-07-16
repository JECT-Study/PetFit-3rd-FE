import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/layouts/MainLayout';
import { PlainLayout } from '@/layouts/PlainLayout';
import { AuthRedirectPage } from '@/pages/AuthRedirectPage';
import { AlarmPage } from '@/pages/AlarmPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { HomePage } from '@/pages/HomePage';
import InfoPage from '@/pages/InfoPage';
import { LoginPage } from '@/pages/LoginPage';
import { MyPage } from '@/pages/MyPage';
import { SignupPetRegisterPage } from '@/pages/SignupPetRegisterPage';
import { SlotSettingPage } from '@/pages/SlotSettingPage';
import { WithdrawPage } from '@/pages/WithdrawPage';

import { PrivateRouter } from './PrivateRouter';

export const router = createBrowserRouter([
  {
    element: <PlainLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/api/auth/kakao/login/dev', element: <AuthRedirectPage /> },
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
          { path: '/info', element: <InfoPage /> },
          { path: '/mypage', element: <MyPage /> },
          { path: '/slot', element: <SlotSettingPage /> },
          { path: '/withdraw', element: <WithdrawPage /> },
        ],
      },
      {
        element: <PlainLayout />,
        children: [{ path: '/signup/pet', element: <SignupPetRegisterPage /> }],
      },
    ],
  },
]);
