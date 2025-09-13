import { useEffect, useState, type InputHTMLAttributes } from 'react';

import styled from 'styled-components';

import { typo } from '@/styles/tokens';
import type { BaseFieldProps } from '@/types/form';
import { MAX_LENGTH, validators, type ValidationType } from '@/utils/validators';

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

interface FormInputProps extends BaseFieldProps, NativeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 입력값 자체를 상위 컴포넌트로 전달 → 상태 업데이트 용도
  validationType: ValidationType;
  placeholder?: string;
  onFieldValidChange: (isValid: boolean) => void; // 입력값의 유효성 상태 (boolean)를 상위 컴포넌트로 전달 → 폼 검증 용도
}

export const FormInput = ({
  label,
  value,
  onChange,
  validationType,
  placeholder,
  onFieldValidChange,
  ...rest
}: FormInputProps) => {
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasError = !!errorMessage;
  const maxLength = MAX_LENGTH[validationType];

  useEffect(() => {
    if (!isTouched) return;

    const { isValid, message } = validators[validationType](value);
    setErrorMessage(!isValid ? message : null);
    onFieldValidChange(isValid);
  }, [value, validationType, isTouched, onFieldValidChange]);

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <FieldGroup>
      {label && <Label $hasError={hasError}>{label}</Label>}
      <StyledInput
        {...rest}
        $hasError={hasError}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        maxLength={maxLength + 10}
        placeholder={placeholder}
      />
      <HelperRow>
        <ErrorMessage $isVisible={hasError}>{errorMessage}</ErrorMessage>
        <CharCount $hasError={hasError}>
          {value.length}/{maxLength}
        </CharCount>
      </HelperRow>
    </FieldGroup>
  );
};

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label<{ $hasError?: boolean }>`
  padding-left: 8px;
  color: ${({ $hasError }) => ($hasError ? 'var(--warning-500)' : 'var(--grey-600)')};
  ${typo.bodyReg14};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 20px;
  background-color: var(--main-100);
  border: 1.5px solid ${({ $hasError }) => ($hasError ? 'var(--warning-500)' : 'var(--main-500)')};
  border-radius: 8px;
  ${({ $hasError }) => ($hasError ? typo.bodySemi14 : typo.bodyReg14)};
`;

const HelperRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
`;

const CharCount = styled.span<{ $hasError?: boolean }>`
  color: ${({ $hasError }) => ($hasError ? 'var(--warning-500)' : 'var(--grey-400)')};
  ${typo.captionMed12};
`;

const ErrorMessage = styled.p<{ $isVisible?: boolean }>`
  color: var(--warning-500);
  ${typo.captionMed12};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
`;
