import { Pencil } from 'lucide-react';
import styled from 'styled-components';

export const Profile = () => {
  return (
    <Container>
      <ProfilePicture></ProfilePicture>
      <UserName>산책이 좋아</UserName>
      <EditButton>
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
  gap: 8px;
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
