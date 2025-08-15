import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { Star, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getPets, patchFavorite } from '@/apis/pets';
import { TitleHeader } from '@/components/common/TitleHeader';
import type { RootState } from '@/store/store';

export const PetManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const memberId = useSelector((s: RootState) => s.user.memberId);
  const { data: pets = [] } = useQuery({
    queryKey: ['pets', memberId],
    queryFn: () => getPets(memberId as number),
    refetchOnMount: 'always',
    select: data => [...data].sort((a, b) => a.id - b.id),
  });
  console.log(pets);
  return (
    <Container>
      <TitleHeader title="반려동물 정보 관리" showBack={true} />

      <CardList>
        {pets.map(p => (
          <PetItem key={p.id}>
            {p.name}
            <button onClick={() => patchFavorite(p.id)}>
              {p.isFavorite ? <Star color="#FFC533" fill="#FFC533" /> : <Star strokeWidth={1.25} />}
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
