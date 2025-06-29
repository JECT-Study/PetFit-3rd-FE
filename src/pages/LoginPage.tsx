import styled from 'styled-components';

import logo from '@/assets/icons/logo.svg';
import kakaoLoginButton from '@/assets/images/kakao_login_medium_wide.png';

export const LoginPage = () => {
  return (
    <Container>
      <Logo src={logo} alt="Petfit 로고" />
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
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 16px;
`;

const Description = styled.p`
  text-align: center;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 40px;
`;

const KakaoButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 250px;
    height: auto;
  }
`;
