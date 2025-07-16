import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRouter = () => {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};
