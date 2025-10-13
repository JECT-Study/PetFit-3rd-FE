import { useEffect, useRef, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { getPetById, putPetsInfo } from '@/apis/pets';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TitleHeader } from '@/components/common/TitleHeader';
import { PetRegisterForm } from '@/components/PetRegisterForm';
import type { RootState } from '@/store/store';
import { tx } from '@/styles/typography';
import type { PetForm, PetGender, PetType } from '@/types/form';
import { usePetForm } from '@/hooks/usePetForm';

export const PetEditPage = () => {
  const { petId } = useParams<{ petId: string }>();
  const id = Number(petId);

  const memberId = useSelector((state: RootState) => state.user.memberId);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<PetForm>({
    name: '',
    species: '강아지',
    gender: '남아',
    birthDate: new Date(),
  });
  const { errors, isValid, setField, onBlurField } = usePetForm(form, setForm);

  useEffect(() => {
    if (!id) navigate('/pet-management', { replace: true });
  }, [id, navigate]);

  const { data: initialForm, isLoading } = useQuery({
    queryKey: ['petDetail', id],
    enabled: !!id,
    queryFn: () => getPetById(id),
    select: d => {
      const dt = d?.birthDate ? new Date(d.birthDate) : new Date();
      return {
        name: d?.name ?? '',
        species: (d?.type as PetType) ?? '강아지',
        gender: (d?.gender as PetGender) ?? '남아',
        birthDate: isNaN(dt.getTime()) ? new Date() : dt,
      } as PetForm;
    },
  });

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && initialForm) {
      setForm(initialForm);
      initializedRef.current = true;
    }
  }, [initialForm]);

  // 수정
  const { mutate, isPending } = useMutation({
    mutationFn: () => putPetsInfo(Number(petId)!, memberId, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['petDetail', id] });
      navigate(-1);
    },
  });

  const handleSave = () => {
    if (!isValid) return;
    mutate();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container>
      <TitleHeader title="반려동물 정보 수정" showBack={true} />

      <PetRegisterForm form={form} errors={errors} onChange={setField} onBlurField={onBlurField} />

      <NextButton onClick={handleSave} disabled={!isValid || isPending}>
        {isPending ? '수정 중...' : '저장'}
      </NextButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 20px;
`;

const NextButton = styled.button`
  position: fixed;
  bottom: 80px;
  left: 20px;
  right: 20px;
  padding: 16px 0;
  border-radius: 12px;
  ${tx.title('semi18')};

  background: ${({ theme }) => theme.color.main[500]};
  color: ${({ theme }) => theme.color.gray[700]};

  &:disabled {
    background: ${({ theme }) => theme.color.gray[100]};
    color: ${({ theme }) => theme.color.gray[400]};
    border: 1px solid ${({ theme }) => theme.color.gray[300]};
    cursor: not-allowed;
  }
`;
