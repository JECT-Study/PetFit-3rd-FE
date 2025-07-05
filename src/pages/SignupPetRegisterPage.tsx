import { useState } from 'react';

import styled from 'styled-components';

import type { PetGender, PetType } from '@/types/common';

const MAX_NAME_LENGTH = 20;

export const SignupPetRegisterPage = () => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetType>('강아지');
  const [gender, setGender] = useState<PetGender>('남아');
  const [birthDate, setBirthDate] = useState('');

  // 유효성 조건 (예: 20자 제한)
  const isNameInvalid = name.length > MAX_NAME_LENGTH;
  const isFormValid = name && !isNameInvalid && species && gender && birthDate;

  return (
    <Container>
      <Title>반려동물 정보 입력</Title>

      <FormSection>
        <FieldGroup>
          <Label $hasError={isNameInvalid}>이름</Label>
          <StyledInput
            $hasError={isNameInvalid}
            placeholder="반려동물의 이름을 입력해주세요."
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <HelperRow>
            <ErrorMessage isVisible={isNameInvalid}>
              {MAX_NAME_LENGTH}자(영문, 한글, 숫자, 특수문자 포함)로 제한됩니다.
            </ErrorMessage>
            <CharCount $hasError={isNameInvalid}>
              {name.length}/{MAX_NAME_LENGTH}
            </CharCount>
          </HelperRow>
        </FieldGroup>

        <FieldGroup>
          <Label>종류</Label>
          <StyledSelect value={species} onChange={e => setSpecies(e.target.value as PetType)}>
            {(['강아지', '고양이', '햄스터', '조류', '어류', '파충류'] as PetType[]).map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </StyledSelect>
        </FieldGroup>

        <FieldGroup>
          <Label>성별</Label>
          <StyledSelect value={gender} onChange={e => setGender(e.target.value as PetGender)}>
            {(['남아', '여아', '중성'] as PetGender[]).map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </StyledSelect>
        </FieldGroup>

        <FieldGroup>
          <Label>생일</Label>
          <StyledInput type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        </FieldGroup>
      </FormSection>

      <NextButton disabled={!isFormValid}>다음</NextButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Title = styled.h2`
  text-align: center;
  padding: 18px 0;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
  margin-top: 42px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label<{ $hasError?: boolean }>`
  padding-left: 8px;
  font-size: 14px;
  color: ${({ $hasError }) => ($hasError ? '#f87171' : '#333')};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  background-color: #fff8e7;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? '#f87171' : '#facc15')};
  border-radius: 8px;
`;

const HelperRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
`;

const CharCount = styled.span<{ $hasError?: boolean }>`
  font-size: 12px;
  color: ${({ $hasError }) => ($hasError ? '#f87171' : '#999')};
`;

const ErrorMessage = styled.p<{ isVisible?: boolean }>`
  color: #f87171;
  font-size: 12px;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
`;

const StyledSelect = styled.select`
  appearance: none;
  padding: 14px 20px;
  font-size: 16px;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
  color: #333;
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
