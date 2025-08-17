import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { TitleHeader } from '@/components/common/TitleHeader';
import { PetRegisterForm } from '@/components/PetRegisterForm';
import { useRegisterPet } from '@/hooks/useRegisterPet';
import type { PetForm } from '@/types/form';

export const AddPetPage = () => {
  const [form, setForm] = useState<PetForm>({
    name: '',
    species: '강아지',
    gender: '남아',
    birthDate: new Date(),
  });
  const [isPetFormValid, setIsPetFormValid] = useState(false);

  const navigate = useNavigate();
  const { register, loading, error } = useRegisterPet();

  const handleRegisterClick = async () => {
    if (!isPetFormValid || loading) return;

    const petInfo = await register(form); // ✅ id 포함 결과

    if (petInfo) {
      navigate('/manage');
    } else if (error) {
      alert(error);
    }
  };

  return (
    <Container>
      <TitleHeader title="반려동물 정보 입력" showBack={true} />

      <PetRegisterForm form={form} setForm={setForm} onFormValidChange={setIsPetFormValid} />

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <NextButton onClick={handleRegisterClick} disabled={!isPetFormValid || loading}>
        {loading ? '등록 중...' : '등록'}
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

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: 8px 0;
  text-align: center;
`;

const NextButton = styled.button<{ disabled?: boolean }>`
  margin-bottom: 24px;
  padding: 16px 0;
  font-size: 16px;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#facc15')};
  border-radius: 12px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;
