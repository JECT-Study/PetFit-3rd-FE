import { useState } from 'react';

import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface BriefCardItem {
  id: number;
  title: string;
  content?: string;
  date?: string;
}

interface BriefCardProps {
  label: string;
  color: string;
  items: BriefCardItem[];
  loading?: boolean;
  error?: string | null;
}

export const BriefCard = ({ label, color, items, loading, error }: BriefCardProps) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const hasContent = items.length > 0;
  const showAccordion = items.length >= 3; // 2개 이상부터 토글 표시
  const visibleItems = expanded ? items : items.slice(0, 2);

  const handleAddClick = () => {
    if (label === '일정') navigate('/alarm');
    else if (label === '특이사항') navigate('/calendar');
  };

  return (
    <Card>
      <Header>
        <ColorBar style={{ backgroundColor: color }} />
        <Title>{label}</Title>
        <AddButton type="button" onClick={handleAddClick} aria-label={`${label} 추가`}>
          <Plus size={20} color="#999" />
        </AddButton>
      </Header>
      <Content>
        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : loading ? (
          <LoadingMessage>불러오는 중...</LoadingMessage>
        ) : hasContent ? (
          <>
            {visibleItems.map(item => (
              <Item key={item.id}>• {item.title}</Item>
            ))}
            {showAccordion && (
              <ToggleWrap>
                <ToggleButton
                  type="button"
                  onClick={() => setExpanded(p => !p)}
                  aria-expanded={expanded}
                  aria-label={expanded ? `${label} 접기` : `${label} 더 보기`}
                >
                  {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </ToggleButton>
              </ToggleWrap>
            )}
          </>
        ) : (
          <NoContent>{label}이 없습니다.</NoContent>
        )}
      </Content>
    </Card>
  );
};

const Card = styled.div`
  flex: 1;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ColorBar = styled.div`
  margin-right: 10px;
  width: 3px;
  height: 24px;
`;

const Title = styled.span`
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.4px;
`;

const AddButton = styled.button`
  font-size: 20px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  color: #d32f2f;
`;

const LoadingMessage = styled.div`
  font-size: 14px;
  color: #888;
`;

const Item = styled.div`
  padding-left: 5px;
  font-size: 14px;
  color: #333;
`;

const ToggleWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: #f5f5f5;
  }
`;

const NoContent = styled.div`
  font-size: 14px;
  color: #aaa;
`;
