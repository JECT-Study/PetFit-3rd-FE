import styled from 'styled-components';

import { CustomDatePicker } from '@/components/CustomDatePicker';

import { CustomSelect } from './CustomSelect';
import { InputBase } from '@/ds/InputBase';
import { Field } from '@/ds/Field';
import { useImeMaxLength } from '@/hooks/useImeMaxLength';
import { PET_NAME_INPUT_MAX, PET_NAME_VALIDATE_MAX } from '@/constants/pet';
import { PET_GENDERS_KO, PET_SPECIES_KO, type PetForm } from '@/types/pet';

interface PetRegisterFormProps {
  form: PetForm;
  errors: Partial<Record<keyof PetForm, string | null>>;
  onChange: <K extends keyof PetForm>(k: K, v: PetForm[K]) => void;
  onBlurField: (field: keyof PetForm) => void;
}

export const PetRegisterForm = ({ form, errors, onChange, onBlurField }: PetRegisterFormProps) => {
  const { imeOnChange, imeOnCompositionEnd, imeOnPaste } = useImeMaxLength({
    setValue: v => onChange('name', v), // ✅ Controlled: 페이지 소유 상태로 반영
    max: PET_NAME_INPUT_MAX,
  });

  return (
    <FormSection>
      <Field
        label="이름"
        hint={errors.name ?? null}
        invalid={!!errors.name}
        count={form.name.length}
        max={PET_NAME_VALIDATE_MAX}
      >
        <InputBase
          id="pet-name"
          placeholder="반려동물의 이름을 입력해주세요."
          value={form.name}
          onChange={imeOnChange} // ✅ IME 안전 onChange
          onCompositionEnd={imeOnCompositionEnd} // ✅ 조합 종료 보정
          onPaste={imeOnPaste} // ✅ 붙여넣기 보정
          onBlur={() => onBlurField('name')}
          maxLength={PET_NAME_INPUT_MAX}
        />
      </Field>

      <CustomSelect
        fieldLabel="종류"
        options={PET_SPECIES_KO}
        value={form.species}
        onChange={val => onChange('species', val)}
      />

      <CustomSelect
        fieldLabel="성별"
        options={PET_GENDERS_KO}
        value={form.gender}
        onChange={val => onChange('gender', val)}
      />

      <CustomDatePicker
        fieldLabel="생일"
        value={form.birthDate}
        onChange={d => onChange('birthDate', d)}
        withYearSelect
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
