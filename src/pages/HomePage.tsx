import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Backpack } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getPets, type Pet } from '@/apis/pets';
import { NameTagBar } from '@/features/home/NameTagBar';
import { TodayBar } from '@/features/home/TodayBar';
import { Routine } from '@/features/routine/Routine';
import { setSelectedPet, type SelectedPetState } from '@/store/petSlice';
import type { RootState } from '@/store/store';
import type { PetListType } from '@/types/pets';

import Logo from '@/assets/icons/logo.svg?react';
import { BriefFeature } from '@/features/home/BriefFeature';

const convertToSelectedPet = (pet: Pet): SelectedPetState => ({
  id: pet.id,
  name: pet.name,
  species: pet.type, // type → species로 매핑
  gender: '남아', // 임시 기본값 설정.
  birthDate: new Date(), // 임시 기본값 설정. 추후 API 응답 수정 필요.
});

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: pets = [] } = useQuery({
    queryKey: ['pets'],
    queryFn: () => getPets(),
    staleTime: 1000 * 60 * 5,
  });

  // 대표 동물을 맨 앞으로 설정
  const sortedPets = pets
    .slice()
    .sort((a: PetListType, b: PetListType) => Number(b.isFavorite) - Number(a.isFavorite));

  // redux에서 현재 선택된 petId 가져오기
  const selectedPetId = useSelector((state: RootState) => state.selectedPet.id);
  const selectedPet = sortedPets.find((pet: Pet) => pet.id === selectedPetId);

  // selectedPetId가 대표 동물로 설정
  useEffect(() => {
    if (sortedPets.length > 0 && selectedPetId === null) {
      const firstPet = sortedPets[0];
      dispatch(setSelectedPet(convertToSelectedPet(firstPet)));
      localStorage.setItem('selectedPetId', String(firstPet.id));
    }
  }, [sortedPets, selectedPetId, dispatch]);

  const handleSelectPet = (id: number) => {
    const pet = sortedPets.find((p: PetListType) => p.id === id);
    if (pet) {
      dispatch(setSelectedPet(convertToSelectedPet(pet)));
      localStorage.setItem('selectedPetId', String(pet.id));
    }
  };

  const today = new Date();

  return (
    <Container>
      <Header>
        <StyledLogo onClick={() => navigate('/')} />
        <Backpack size={24} stroke="#444" />
      </Header>

      <TopSection>
        <NameTagBar names={sortedPets} selectedPetId={selectedPetId} onSelect={handleSelectPet} />
        <TodayBar />
      </TopSection>

      {selectedPet && (
        <>
          <BriefFeature petId={selectedPet.id} today={today} />

          <div>
            <Routine petId={selectedPet.id} />
          </div>
        </>
      )}
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
  width: 40px;
  height: 28px;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 24px;
`;
