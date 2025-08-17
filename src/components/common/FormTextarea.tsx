import { useEffect, useState } from 'react';

import styled from 'styled-components';

import { typo } from '@/styles/tokens';
import type { BaseFieldProps } from '@/types/form';
import { MAX_LENGTH, validators, type ValidationType } from '@/utils/validators';

interface FormTextareaProps extends BaseFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  validationType: ValidationType;
  placeholder?: string;
  onFieldValidChange: (isValid: boolean) => void;
}

export const FormTextarea = ({
  label,
  value,
  onChange,
  validationType,
  placeholder,
  onFieldValidChange,
}: FormTextareaProps) => {
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
      <StyledTextarea
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

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  height: 100px;
  padding: 12px 20px;
  background-color: var(--main-100);
  border: 1.5px solid ${({ $hasError }) => ($hasError ? 'var(--warning-500)' : 'var(--main-500)')};
  border-radius: 16px;
  ${typo.bodySemi14};
  resize: none;
`;

const HelperRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
`;

const CharCount = styled.span<{ $hasError?: boolean }>`
  ${typo.captionMed12};
  color: ${({ $hasError }) => ($hasError ? 'var(--warning-500)' : 'var(--grey-400)')};
`;

const ErrorMessage = styled.p<{ $isVisible?: boolean }>`
  color: var(--warning-500);
  ${typo.captionMed12};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
`;
