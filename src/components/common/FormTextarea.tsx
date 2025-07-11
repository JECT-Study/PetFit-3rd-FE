import styled from 'styled-components';

import type { BaseFieldProps } from '@/types/form';

interface FormTextareaProps extends BaseFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  hasError?: boolean;
  errorMessage?: string;
  showCount?: boolean;
  maxLength?: number;
  placeholder?: string;
}

export const FormTextarea = ({
  label,
  value,
  onChange,
  onBlur,
  hasError = false,
  errorMessage,
  showCount = true,
  maxLength = 300,
  placeholder,
}: FormTextareaProps) => {
  return (
    <FieldGroup>
      {label && <Label $hasError={hasError}>{label}</Label>}
      <StyledTextarea
        $hasError={hasError}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength + 10}
        placeholder={placeholder}
      />
      <HelperRow>
        <ErrorMessage isVisible={hasError}>{errorMessage}</ErrorMessage>
        {showCount && (
          <CharCount $hasError={hasError}>
            {value.length}/{maxLength}
          </CharCount>
        )}
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
  font-size: 14px;
  color: ${({ $hasError }) => ($hasError ? '#f87171' : '#333')};
`;

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  height: 100px;
  padding: 12px 20px;
  font-size: 16px;
  background-color: #fff8e7;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? '#f87171' : '#facc15')};
  border-radius: 16px;
  resize: none;
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
