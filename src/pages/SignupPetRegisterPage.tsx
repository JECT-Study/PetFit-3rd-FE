import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PetRegisterForm } from '@/components/PetRegisterForm';
import type { PetForm } from '@/types/form';

export const SignupPetRegisterPage = () => {
  const [form, setForm] = useState<PetForm>({
    name: '',
    species: '강아지',
    gender: '남아',
    birthDate: new Date(),
  });
  const [isPetFormValid, setIsPetFormValid] = useState(false);
  const navigate = useNavigate();

  return (
    <Container>
      <Title>반려동물 정보 입력</Title>

      <PetRegisterForm form={form} setForm={setForm} onFormValidChange={setIsPetFormValid} />

      <NextButton onClick={() => navigate('/slot')} disabled={!isPetFormValid}>
        다음
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

const Title = styled.h2`
  text-align: center;
  padding: 18px 0;
`;

const NextButton = styled.button<{ disabled?: boolean }>`
  margin-bottom: 24px;
  padding: 16px 0;
  font-size: 16px;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#facc15')};
  color: #000;
  border: none;
  border-radius: 12px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;
