import React from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getPets, putFavorite, type Pet } from '@/apis/pets';
import { TitleHeader } from '@/components/common/TitleHeader';
import { setSelectedPet, type SelectedPetState } from '@/store/petSlice';
import type { RootState } from '@/store/store';
import type { PetListType } from '@/types/pets';

const convertToSelectedPet = (pet: Pet): SelectedPetState => ({
  id: pet.id,
  name: pet.name,
  species: pet.type, // type → species로 매핑
  gender: '남아', // 임시 기본값 설정.
  birthDate: new Date(), // 임시 기본값 설정. 추후 API 응답 수정 필요.
});

export const PetManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const memberId = useSelector((s: RootState) => s.user.memberId);
  const { data: pets = [] } = useQuery({
    queryKey: ['pets', memberId],
    queryFn: () => getPets(memberId as number),
    refetchOnMount: 'always',
    select: data => [...data].sort((a, b) => a.id - b.id),
  });

  const favoriteMutation = useMutation({
    mutationFn: (petId: number) => putFavorite(petId),
    onSuccess: (_, petId) => {
      queryClient.invalidateQueries({ queryKey: ['pets', memberId] });
      const pet = pets.find((p: PetListType) => p.id === petId);
      if (pet) {
        dispatch(setSelectedPet(convertToSelectedPet(pet)));
        localStorage.setItem('selectedPetId', String(petId));
      }
    },
  });

  return (
    <Container>
      <TitleHeader title="반려동물 정보 관리" showBack={true} />

      <CardList>
        {pets.map(p => (
          <PetItem key={p.id}>
            <button onClick={() => navigate(`/edit/pet/${p.id}`)}>{p.name}</button>
            <button onClick={() => favoriteMutation.mutate(p.id)}>
              {p.isFavorite ? (
                <Star color="#FFC533" fill="#FFC533" />
              ) : (
                <Star strokeWidth={1.25} color="#000000" />
              )}
            </button>
          </PetItem>
        ))}
        <AddPetButton onClick={() => navigate('/add/pet')}>
          <Plus size={20} />
          반려동물 추가
        </AddPetButton>
      </CardList>
    </Container>
  );
};

const Container = styled.div`
  margin: 20px;
`;
const CardList = styled.div`
  display: grid;
  gap: 12px;
`;

const Item = styled.div`
  display: flex;
  border-radius: 16px;
  border-width: 1px;
  padding: 16px 20px;
  background: #fff8e5;
  border: 1px solid #ffc533;
  font-size: 14px;
`;

const PetItem = styled(Item)`
  justify-content: space-between;
`;

const AddPetButton = styled(Item)`
  justify-content: center;
  cursor: pointer;
  gap: 3px;
`;
