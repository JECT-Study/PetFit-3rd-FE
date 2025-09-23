import { useState } from 'react';

import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { TitleHeader } from '@/components/common/TitleHeader';
import { ToggleButton } from '@/components/common/ToggleButton';
import { LogoutModal } from '@/features/mypage/LogoutModal';
import { Profile } from '@/features/mypage/Profile';

export const MyPage = () => {
  const [logoutModal, setLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleAlarmToggle = (isOn: boolean) => {
    if (isOn) {
      console.log('알람 on');
    } else {
      console.log('알람 off');
    }
  };

  return (
    <div>
      <TitleHeader title="마이페이지" />
      <Profile />
      <LineBar></LineBar>
      <MenuContainer>
        <MenuTitle>반려동물 설정</MenuTitle>
        <Menu onClick={() => navigate('/manage')}>
          반려동물 정보 관리 <ChevronRight size={20} />
        </Menu>

        <MenuTitle>기타</MenuTitle>
        <Menu>
          알림 <ToggleButton onToggle={handleAlarmToggle} />
        </Menu>
        <Menu>버전 정보</Menu>
        <Menu onClick={() => setLogoutModal(true)}>
          로그아웃 <ChevronRight size={20} />
        </Menu>
        <Menu onClick={() => navigate('/withdraw')}>
          <DeleteButton>탈퇴하기</DeleteButton>
          <ChevronRight size={20} />
        </Menu>
      </MenuContainer>

      {/* 로그아웃 모달 */}
      <LogoutModal isOpen={logoutModal} onClose={() => setLogoutModal(false)} />
    </div>
  );
};

const LineBar = styled.div`
  width: 100%;
  height: 4px;
  margin: 30px 0;
  background: #e0e0e0;
`;
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
  &:hover {
    cursor: pointer;
  }
`;

const DeleteButton = styled.div`
  color: #ff5c33;
`;
