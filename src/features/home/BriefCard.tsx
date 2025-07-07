import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface BriefCardProps {
  title: string;
  color: string;
  items: string[];
}

export const BriefCard = ({ title, color, items }: BriefCardProps) => {
  const navigate = useNavigate();
  const hasContent = items.length > 0;

  const handleAddClick = () => {
    if (title === '일정') navigate('/alarm');
    else if (title === '특이사항') navigate('/calendar');
  };

  return (
    <Card>
      <Header>
        <ColorBar style={{ backgroundColor: color }} />
        <Title>{title}</Title>
        <AddButton type="button" onClick={handleAddClick} aria-label={`${title} 추가`}>
          <Plus size={20} color="#999" />
        </AddButton>
      </Header>
      <Content>
        {hasContent ? (
          items.slice(0, 2).map((item, i) => <Item key={i}>• {item}</Item>)
        ) : (
          <NoContent>{title}이 없습니다.</NoContent>
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
  margin-right: 8px;
  width: 4px;
  height: 24px;
  border-radius: 2px;
`;

const Title = styled.span`
  flex: 1;
  font-size: 16px;
  font-weight: 600;
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

const Item = styled.div`
  padding-left: 5px;
  font-size: 14px;
  color: #333;
`;

const NoContent = styled.div`
  font-size: 14px;
  color: #aaa;
`;
