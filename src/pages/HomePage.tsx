import { Backpack } from 'lucide-react';
import styled from 'styled-components';

import { BaseModal } from '@/components/common/BaseModal';
import { BriefCard } from '@/features/home/BriefCard';
import { NameTagBar } from '@/features/home/NameTagBar';
import { TodayBar } from '@/features/home/TodayBar';
import { useModal } from '@/hooks/useModal';
import { nameListMock, noticeMock, scheduleMock } from '@/mocks/homeData';

import Logo from '@/assets/icons/logo.svg?react';

export const HomePage = () => {
  const { isOpen, openModal, closeModal } = useModal();

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
          <BriefCard title="일정" color="#3B82F6" items={scheduleMock} />
          <BriefCard title="특이사항" color="#EF4444" items={noticeMock} />
        </CardRow>
      </BriefingSection>

      <div>
        <button onClick={openModal}>모달 열기 버튼</button>
        <BaseModal isOpen={isOpen} onClose={closeModal}>
          <p>모달 내용</p>
        </BaseModal>
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
