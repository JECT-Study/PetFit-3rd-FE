import { useEffect, useState } from 'react';

import styled from 'styled-components';

import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomSelect } from '@/components/CustomSelect';
import type { PetGender, PetType } from '@/types/common';
import {
  getPetNameValidationMessage,
  isValidPetName,
  MAX_NAME_LENGTH,
} from '@/utils/petNameValidation';

interface PetRegisterFormProps {
  name: string;
  setName: (val: string) => void;
  species: PetType;
  setSpecies: (val: PetType) => void;
  gender: PetGender;
  setGender: (val: PetGender) => void;
  birthDate: string;
  setBirthDate: (val: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const PetRegisterForm = ({
  name,
  setName,
  species,
  setSpecies,
  gender,
  setGender,
  birthDate,
  setBirthDate,
  onValidationChange,
}: PetRegisterFormProps) => {
  const [isNameTouched, setIsNameTouched] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    if (!isNameTouched && newValue.length > 0) {
      setIsNameTouched(true);
    }
  };

  const isNameInvalid = isNameTouched && !isValidPetName(name);
  const nameErrorMessage = isNameTouched ? getPetNameValidationMessage(name) : null;

  // ✅ 유효성 계산 → 부모에게 전달
  useEffect(() => {
    const isFormValid = !isNameInvalid && species && gender && birthDate;
    onValidationChange?.(!!isFormValid);
  }, [isNameInvalid, species, gender, birthDate, onValidationChange]);

  return (
    <FormSection>
      <FieldGroup>
        <Label $hasError={isNameInvalid}>이름</Label>
        <StyledInput
          $hasError={isNameInvalid}
          value={name}
          onChange={handleNameChange}
          onBlur={() => setIsNameTouched(true)}
          placeholder="반려동물의 이름을 입력해주세요."
          maxLength={MAX_NAME_LENGTH + 10}
        />
        <HelperRow>
          <ErrorMessage isVisible={isNameInvalid}>{nameErrorMessage}</ErrorMessage>
          <CharCount $hasError={isNameInvalid}>
            {name.length}/{MAX_NAME_LENGTH}
          </CharCount>
        </HelperRow>
      </FieldGroup>

      <FieldGroup>
        <Label>종류</Label>
        {/* <StyledSelect value={species} onChange={e => setSpecies(e.target.value as PetType)}>
            {(['강아지', '고양이', '햄스터', '조류', '어류', '파충류'] as PetType[]).map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </StyledSelect> */}
        <CustomSelect
          value={species ? { label: species, value: species } : null}
          onChange={val => setSpecies(val as PetType)}
          options={[
            { label: '강아지', value: '강아지' },
            { label: '고양이', value: '고양이' },
            { label: '햄스터', value: '햄스터' },
            { label: '조류', value: '조류' },
            { label: '어류', value: '어류' },
            { label: '파충류', value: '파충류' },
          ]}
        />
      </FieldGroup>

      <FieldGroup>
        <Label>성별</Label>
        {/* <StyledSelect value={gender} onChange={e => setGender(e.target.value as PetGender)}>
            {(['남아', '여아', '중성'] as PetGender[]).map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </StyledSelect> */}
        <CustomSelect
          value={gender ? { label: gender, value: gender } : null}
          onChange={val => setGender(val as PetGender)}
          options={[
            { label: '남아', value: '남아' },
            { label: '여아', value: '여아' },
            { label: '중성', value: '중성' },
          ]}
        />
      </FieldGroup>

      <FieldGroup>
        <Label>생일</Label>
        <CustomDatePicker value={birthDate} onChange={setBirthDate} />
      </FieldGroup>
    </FormSection>
  );
};

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

// const StyledSelect = styled.select`
//   appearance: none;
//   padding: 14px 20px;
//   font-size: 16px;
//   background-color: #fff8e7;
//   border: 1.5px solid #facc15;
//   border-radius: 8px;
//   color: #333;
// `;
