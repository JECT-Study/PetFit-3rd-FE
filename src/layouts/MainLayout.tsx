import { Outlet } from 'react-router-dom';

import { BottomNav } from '@/components/common/BottomNav';
import { ResponsiveContainer } from '@/components/common/ResponsiveContainer';

export const MainLayout = () => {
  return (
    <ResponsiveContainer>
      <Outlet />
      <BottomNav />
    </ResponsiveContainer>
  );
};
