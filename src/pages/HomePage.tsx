import { useQuery } from '@tanstack/react-query';
import { Backpack } from 'lucide-react';
import styled from 'styled-components';

import { getPets } from '@/apis/pets';
import { BriefCard } from '@/features/home/BriefCard';
import { NameTagBar } from '@/features/home/NameTagBar';
import { TodayBar } from '@/features/home/TodayBar';
import { Routine } from '@/features/routine/Routine';
import { noticeMock, scheduleMock } from '@/mocks/homeData';
import type { PetListType } from '@/types/pets';

import Logo from '@/assets/icons/logo.svg?react';

export const HomePage = () => {
  const { data: pets } = useQuery<PetListType[]>({
    queryKey: ['pets'],
    queryFn: () => getPets(),
    staleTime: 1000 * 60 * 5,
  });

  const sortedPets =
    pets?.slice().sort((a, b) => {
      return Number(b.isFavorite) - Number(a.isFavorite);
    }) ?? [];

  return (
    <Container>
      <Header>
        <StyledLogo />
        <Backpack size={24} stroke="#444" />
      </Header>

      <TopSection>
        <NameTagBar names={sortedPets} />
        <TodayBar />
      </TopSection>

      <BriefingSection>
        <SectionTitle>오늘의 브리핑</SectionTitle>
        <CardRow>
          <BriefCard title="일정" color="#4D9DE0" items={scheduleMock} />
          <BriefCard title="특이사항" color="#FF5C33" items={noticeMock} />
        </CardRow>
      </BriefingSection>

      <div>
        <Routine />
      </div>
    </Container>
  );
};

const Container = styled.div``;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
`;

const StyledLogo = styled(Logo)`
  height: 28px;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 24px;
`;

const BriefingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const CardRow = styled.div`
  display: flex;
  gap: 8px;
`;
