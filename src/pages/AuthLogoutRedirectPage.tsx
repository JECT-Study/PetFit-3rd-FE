import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

export const AuthLogoutRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('selectedPetId');
    // Redux 초기화

    navigate('/login');
  }, [navigate]);

  return <div>로그아웃 중</div>;
};
