import styled from 'styled-components';

import kakaoLoginButton from '@/assets/images/kakao_login_medium_wide.png';

import Logo from '@/assets/icons/logo.svg?react';

export const LoginPage = () => {
  return (
    <Container>
      <Logo width={100} height={70} />
      <Description>
        펫핏에서 반려동물의
        <br />
        건강을 기록하고, 진단해보세요!
      </Description>
      <KakaoButton>
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
  background-color: white;
  gap: 30px;
`;

const Description = styled.p`
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  color: #333;
`;

const KakaoButton = styled.button`
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;

  img {
    width: 250px;
    height: auto;
  }
`;
