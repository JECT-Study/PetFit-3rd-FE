import styled from 'styled-components';

interface NameTag {
  name: string;
  isMain: boolean;
}

interface NameTagBarProps {
  names: NameTag[];
}

export const NameTagBar = ({ names }: NameTagBarProps) => {
  return (
    <Wrapper>
      {names.map(({ name, isMain }, idx) => (
        <Tag key={idx} $isMain={isMain}>
          {name}
        </Tag>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 20px;
`;

const Tag = styled.div<{ $isMain?: boolean }>`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: ${({ $isMain }) => ($isMain ? 700 : 400)};
  color: ${({ $isMain }) => ($isMain ? '#333' : '#999')};
  border: ${({ $isMain }) => ($isMain ? '2px solid #FACC15' : 'none')};
  background-color: ${({ $isMain }) => ($isMain ? '#fff' : 'transparent')};
`;
