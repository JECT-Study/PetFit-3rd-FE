import { useEffect } from 'react';

import { Backpack } from 'lucide-react';
import styled from 'styled-components';

import { getPets } from '@/apis/pets';
import { BriefCard } from '@/features/home/BriefCard';
import { NameTagBar } from '@/features/home/NameTagBar';
import { TodayBar } from '@/features/home/TodayBar';
import { Routine } from '@/features/routine/Routine';
import { nameListMock, noticeMock, scheduleMock } from '@/mocks/homeData';

import Logo from '@/assets/icons/logo.svg?react';

export const HomePage = () => {
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
        console.log('🐾 pets:', data);
      } catch (err) {
        console.error('펫 데이터 불러오기 실패:', err);
      }
    };

    fetchPets();
  }, []);
  return (
    <Container>
      <Header>
        <StyledLogo />
        <Backpack size={24} stroke="#444" />
      </Header>

      <TopSection>
        <NameTagBar names={nameListMock} />
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
