import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/layouts/MainLayout';
import { PlainLayout } from '@/layouts/PlainLayout';
import AlarmPage from '@/pages/AlarmPage';
import CalendarPage from '@/pages/CalendarPage';
import HomePage from '@/pages/HomePage';
import InfoPage from '@/pages/InfoPage';
import LoginPage from '@/pages/LoginPage';
import MyPage from '@/pages/MyPage';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/alarm', element: <AlarmPage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/info', element: <InfoPage /> },
      { path: '/mypage', element: <MyPage /> },
    ],
  },
  {
    element: <PlainLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
]);
