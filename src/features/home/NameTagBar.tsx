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
      <Inner>
        {names.map(({ name, isMain }, idx) => (
          <Tag key={idx} $isMain={isMain}>
            {name}
          </Tag>
        ))}
      </Inner>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  overflow-x: auto;
  padding: 0 20px;

  /* 스크롤바 감추기 (선택사항) */
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    height: 0; /* Chrome, Safari */
  }

  /* hover 시 스크롤바 나타남 */
  &:hover {
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #999;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  /* 모바일에서 스크롤 가능하게 설정 */
  -webkit-overflow-scrolling: touch;

  cursor: grab;
`;

const Inner = styled.div`
  display: flex;
  gap: 12px;
  white-space: nowrap;
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
