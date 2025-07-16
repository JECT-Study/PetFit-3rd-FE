import { useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';

import { CustomDatePicker } from '@/components/CustomDatePicker';
import type { PetForm, PetGender, PetType } from '@/types/form';

import { FormInput } from './common/FormInput';
import { CustomSelect } from './CustomSelect';

interface PetRegisterFormProps {
  form: PetForm;
  setForm: (val: PetForm) => void;
  onFormValidChange: (isValid: boolean) => void;
}

export const PetRegisterForm = ({ form, setForm, onFormValidChange }: PetRegisterFormProps) => {
  const [formValidity, setFormValidity] = useState({
    name: false,
    species: true,
    gender: true,
    birthDate: true,
  });

  useEffect(() => {
    const isValid = Object.values(formValidity).every(Boolean);
    onFormValidChange(isValid);
  }, [formValidity, onFormValidChange]);

  // 렌더링마다 함수 재생성 방지
  const fieldValidHandlers = useMemo(
    () => ({
      name: (isValid: boolean) => {
        setFormValidity(prev => ({ ...prev, name: isValid }));
      },
      // 필요 시 다른 필드도 정의 가능
      // species: ...
    }),
    []
  );

  return (
    <FormSection>
      <FormInput
        label="이름"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        validationType="petName"
        placeholder="반려동물의 이름을 입력해주세요."
        onFieldValidChange={fieldValidHandlers.name}
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
