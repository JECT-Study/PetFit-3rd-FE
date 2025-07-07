import { useState } from 'react';

import styled from 'styled-components';

import { PetRegisterForm } from '@/components/PetRegisterForm';
import type { PetGender, PetType } from '@/types/common';

export const SignupPetRegisterPage = () => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetType>('강아지');
  const [gender, setGender] = useState<PetGender>('남아');
  const [birthDate, setBirthDate] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  return (
    <Container>
      <Title>반려동물 정보 입력</Title>

      <PetRegisterForm
        name={name}
        setName={setName}
        species={species}
        setSpecies={setSpecies}
        gender={gender}
        setGender={setGender}
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        onValidationChange={setIsFormValid}
      />

      <NextButton disabled={!isFormValid}>다음</NextButton>
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
