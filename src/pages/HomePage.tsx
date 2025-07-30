import { Backpack } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { BriefCard } from '@/features/home/BriefCard';
import { NameTagBar } from '@/features/home/NameTagBar';
import { TodayBar } from '@/features/home/TodayBar';
import { Routine } from '@/features/routine/Routine';
import { useBriefCardData } from '@/hooks/useBriefCardData';
import { nameListMock } from '@/mocks/homeData';
import type { RootState } from '@/store/store';

import Logo from '@/assets/icons/logo.svg?react';

export const HomePage = () => {
  // ✅ 전역 상태에서 selectedPet.id 추출
  const petId = useSelector((state: RootState) => state.selectedPet.id);

  const { schedules, remarks, loading, error } = useBriefCardData(petId ?? -1);

  const navigate = useNavigate();
  return (
    <Container>
      <Header>
        <StyledLogo onClick={() => navigate('/signup/pet')} />
        <Backpack size={24} stroke="#444" />
      </Header>

      <TopSection>
        <NameTagBar names={nameListMock} />
        <TodayBar />
      </TopSection>

      <BriefingSection>
        <SectionTitle>오늘의 브리핑</SectionTitle>
        <CardRow>
          <BriefCard
            label="일정"
            color="#4D9DE0"
            items={schedules.map(s => ({
              id: s.scheduleId,
              title: s.title,
              date: s.targetDate,
            }))}
            loading={loading.schedules}
            error={error.schedules}
          />
          <BriefCard
            label="특이사항"
            color="#FF5C33"
            items={remarks.map(r => ({
              id: r.remarkId,
              title: r.title,
              date: r.remarkDate,
            }))}
            loading={loading.remarks}
            error={error.remarks}
          />
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
