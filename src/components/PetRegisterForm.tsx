import { useEffect, useState } from 'react';

import styled from 'styled-components';

import { CustomDatePicker } from '@/components/CustomDatePicker';
import type { PetGender, PetType } from '@/types/common';
import {
  getPetNameValidationMessage,
  isValidPetName,
  MAX_NAME_LENGTH,
} from '@/utils/petNameValidation';

import { FormInput } from './common/FormInput';
import { CustomSelect } from './CustomSelect';

interface PetForm {
  name: string;
  species: PetType;
  gender: PetGender;
  birthDate: string;
}

interface PetRegisterFormProps {
  form: PetForm;
  setForm: (val: PetForm) => void;
  onValidationChange: (isValid: boolean) => void;
}

export const PetRegisterForm = ({ form, setForm, onValidationChange }: PetRegisterFormProps) => {
  const [isNameTouched, setIsNameTouched] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm({ ...form, name });
    if (!isNameTouched && name.length > 0) {
      setIsNameTouched(true);
    }
  };

  const isNameInvalid = isNameTouched && !isValidPetName(form.name);
  const nameErrorMessage = isNameTouched ? getPetNameValidationMessage(form.name) : null;

  // ✅ 유효성 계산 → 부모에게 전달
  useEffect(() => {
    const isValid = !isNameInvalid && form.species && form.gender && form.birthDate;
    onValidationChange?.(!!isValid);
  }, [form, isNameInvalid, onValidationChange]);

  return (
    <FormSection>
      <FormInput
        label="이름"
        value={form.name}
        onChange={handleNameChange}
        onBlur={() => setIsNameTouched(true)}
        hasError={isNameInvalid}
        errorMessage={nameErrorMessage}
        maxLength={MAX_NAME_LENGTH}
        placeholder="반려동물의 이름을 입력해주세요."
      />

      <CustomSelect
        label="종류"
        value={form.species}
        onChange={val => setForm({ ...form, species: val as PetType })}
        options={[
          { label: '강아지', value: '강아지' },
          { label: '고양이', value: '고양이' },
          { label: '햄스터', value: '햄스터' },
          { label: '조류', value: '조류' },
          { label: '어류', value: '어류' },
          { label: '파충류', value: '파충류' },
        ]}
      />

      <CustomSelect
        label="성별"
        value={form.gender}
        onChange={val => setForm({ ...form, gender: val as PetGender })}
        options={[
          { label: '남아', value: '남아' },
          { label: '여아', value: '여아' },
          { label: '중성', value: '중성' },
        ]}
      />

      <CustomDatePicker
        label="생일"
        value={form.birthDate}
        onChange={birthDate => setForm({ ...form, birthDate })}
      />
    </FormSection>
  );
};

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
  margin: 42px 0 20px;
`;
