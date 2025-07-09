import { useState } from 'react';

import { ChevronRight } from 'lucide-react';
import styled from 'styled-components';

import { Header } from '@/components/common/Header';
import { LogoutModal } from '@/features/mypage/LogoutModal';
import { Profile } from '@/features/mypage/Profile';

export const MyPage = () => {
  const [logoutModal, setLogoutModal] = useState(false);
  return (
    <div>
      <Header title="마이페이지" />
      <Profile />
      <MenuContainer>
        <MenuTitle>반려동물 설정</MenuTitle>
        <Menu>
          반려동물 정보 관리 <ChevronRight size={20} />
        </Menu>

        <MenuTitle>기타</MenuTitle>
        <Menu>버전 정보</Menu>
        <Menu onClick={() => setLogoutModal(true)}>
          로그아웃 <ChevronRight size={20} />
        </Menu>
        <Menu>
          <DeleteButton>탈퇴하기</DeleteButton>
          <ChevronRight size={20} />
        </Menu>
      </MenuContainer>

      {/* 로그아웃 모달 */}
      <LogoutModal isOpen={logoutModal} onClose={() => setLogoutModal(false)} />
    </div>
  );
};

const MenuContainer = styled.div`
  margin-top: 20px;
`;

const MenuTitle = styled.div`
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 500;
  color: #666666;
`;

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-size: 13px;
  font-weight: 500;
  border-bottom: 1px #f0f0f0 solid;
`;

const DeleteButton = styled.div`
  color: #ff5c33;
`;
