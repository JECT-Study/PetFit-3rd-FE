import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PetRegisterForm } from '@/components/PetRegisterForm';
import { useRegisterPet } from '@/hooks/useRegisterPet';
import { setSelectedPet, setSelectedPetId } from '@/store/petSlice';
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
  const dispatch = useDispatch();
  const { register, loading, error } = useRegisterPet();

  const handleNextClick = async () => {
    if (!isPetFormValid || loading) return;

    const petInfo = await register(form); // ✅ id 포함 결과

    if (petInfo) {
      dispatch(setSelectedPet(petInfo)); // ✅ 전역 상태로 저장
      dispatch(setSelectedPetId(petInfo.id)); // localStorage에 id만 따로 저장
      navigate('/slot');
    } else if (error) {
      alert(error);
    }
  };

  return (
    <Container>
      <Title>반려동물 정보 입력</Title>

      <PetRegisterForm form={form} setForm={setForm} onFormValidChange={setIsPetFormValid} />

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <NextButton onClick={handleNextClick} disabled={!isPetFormValid || loading}>
        {loading ? '등록 중...' : '다음'}
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
  color: #000;
  border: none;
  border-radius: 12px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;
