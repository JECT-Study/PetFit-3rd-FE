import styled from 'styled-components';

import { MoreActionDropdown } from '@/components/common/MoreActionDropdown';

import NoticeIcon from '@/assets/icons/notice.svg?react';

interface NoteItemProps {
  title: string;
  content: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteItem = ({ title, content, onEdit, onDelete }: NoteItemProps) => {
  return (
    <Container>
      <StatusIcon>
        <NoticeIcon />
      </StatusIcon>
      <Content>
        <Title>{title}</Title>
        <Memo>{content}</Memo>
      </Content>
      <MoreActionDropdown onEdit={onEdit} onDelete={onDelete} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
`;

const StatusIcon = styled.div`
  margin-right: 12px;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const Memo = styled.div`
  font-size: 14px;
  color: gray;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
