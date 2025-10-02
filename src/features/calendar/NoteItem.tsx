import styled from 'styled-components';

import { OverflowMenu } from '@/components/common/OverflowMenu';

import { AlertCircle } from 'lucide-react';
import { tx } from '@/styles/typography';

interface NoteItemProps {
  title: string;
  content: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteItem = ({ title, content, onEdit, onDelete }: NoteItemProps) => {
  return (
    <Container>
      <Start>
        <TitleRow>
          <WarningIcon />
          <Title>{title}</Title>
        </TitleRow>
        <BodyText>{content}</BodyText>
      </Start>
      <Actions>
        <OverflowMenu onEdit={onEdit} onDelete={onDelete} />
      </Actions>
    </Container>
  );
};

const Container = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
`;

const Start = styled.div`
  flex: 1;
  min-width: 0;
`;

const Actions = styled.div`
  flex: 0 0 auto; /* 수축 방지 */
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
`;

const WarningIcon = styled(AlertCircle).attrs({
  size: 20,
  strokeWidth: 2,
  'aria-label': '경고',
  role: 'img',
})`
  /* 배경 원: 경고 색으로 채우고 외곽선 제거 */
  & circle {
    fill: var(--main-500);
    stroke: none;
  }
  /* 느낌표(경고 마크): 흰색 스트로크 */
  & line {
    stroke: #fff;
  }
`;

const Title = styled.div`
  ${tx.body('semi14')};
  color: ${({ theme }) => theme.color.gray[700]};
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BodyText = styled.div`
  ${tx.body('reg14')};
  color: ${({ theme }) => theme.color.gray[500]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
