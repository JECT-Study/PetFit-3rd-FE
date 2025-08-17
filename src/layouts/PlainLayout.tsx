import { Outlet } from 'react-router-dom';

import { ResponsiveContainer } from '@/components/common/ResponsiveContainer';

export const PlainLayout = () => {
  return (
    <ResponsiveContainer>
      <Outlet />
    </ResponsiveContainer>
  );
};
