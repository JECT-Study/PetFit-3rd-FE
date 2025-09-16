import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getNickname } from '@/apis/auth';
import type { RootState } from '@/store/store';

import DefaultProfile from '@/assets/icons/default-profile.svg?react';

export const Profile = () => {
  const navigate = useNavigate();
  const memberId = useSelector((state: RootState) => state.user.memberId);

  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getNickname(memberId),
  });

  const handleEditClick = () => {
    navigate('/edit/nickname');
  };

  return (
    <Container onClick={handleEditClick}>
      <UserProfile>
        <DefaultProfile onClick={e => e.stopPropagation()} />
        <UserName>{userInfo?.nickname}</UserName>
      </UserProfile>
      <ChevronRight size={20} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 16px;
  &:hover {
    cursor: pointer;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserName = styled.div`
  font-size: 16px;
`;
