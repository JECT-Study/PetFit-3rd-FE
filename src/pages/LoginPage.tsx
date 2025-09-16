import styled from 'styled-components';

import kakaoLoginButton from '@/assets/images/kakao_login_medium_wide.png';
import { tx } from '@/styles/typography';

import Logo from '@/assets/icons/logo.svg?react';

export const LoginPage = () => {
  const handleKakaoLogin = () => {
    const kakaoAuthURI = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_APP_KAKAO_APP_KEY}&redirect_uri=${import.meta.env.VITE_APP_KAKAO_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthURI;
  };

  return (
    <Container>
      <Logo width={100} height={70} />
      <Description>
        펫핏에서 반려동물의
        <br />
        건강을 기록하고, 진단해보세요!
      </Description>
      <KakaoButton onClick={handleKakaoLogin}>
        <img src={kakaoLoginButton} alt="카카오로 시작하기" />
      </KakaoButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.color.white};
  gap: 30px;
`;

const Description = styled.p`
  text-align: center;
  ${tx.body('med18')};
`;

const KakaoButton = styled.button`
  padding: 0;

  img {
    width: 250px;
    height: auto;
  }
`;
