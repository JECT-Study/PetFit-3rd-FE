import { useQuery } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getNickname } from '@/apis/auth';

// import type { RootState } from '@/store/store';
export const Profile = () => {
  const navigate = useNavigate();
  // const nickname = useSelector((state: RootState) => state.user.nickname);

  // redux에 저장된 nickname을 가져오는 로직으로 바뀔 수 있음
  // 임의로 memberId = 2 로 요청 보냄
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getNickname(2),
  });

  const handleEditClick = () => {
    navigate('/edit-nickname');
  };
  return (
    <Container>
      <ProfilePicture></ProfilePicture>
      <UserName>{userInfo?.nickname}</UserName>
      <EditButton onClick={handleEditClick}>
        <Pencil size={16} />
        프로필 편집
      </EditButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
`;

const ProfilePicture = styled.div`
  height: 62px;
  width: 62px;
  border-radius: 999px;
  background-color: #d9d9d9;
`;

const UserName = styled.div`
  font-size: 16px;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  gap: 6px;
  width: 178px;
  height: 32px;
  border-radius: 4px;
  padding-top: 6px;
  padding-right: 20px;
  padding-bottom: 6px;
  padding-left: 20px;
  background: #fff8e5;
  border: 1px solid #ffc533;
`;
