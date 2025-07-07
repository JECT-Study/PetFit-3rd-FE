import Select from 'react-select';
import type { Props as SelectProps } from 'react-select';
import styled from 'styled-components';

export interface Option {
  label: string;
  value: string;
}

type CustomSelectProps = {
  value: Option | null;
  onChange: (value: string) => void;
  options: Option[];
};

export const CustomSelect = ({ value, onChange, options }: CustomSelectProps) => {
  return (
    <StyledSelect
      options={options}
      value={value}
      onChange={option => onChange((option as Option)?.value ?? '')}
    />
  );
};

const BaseSelect = (props: SelectProps<Option>) => (
  <Select classNamePrefix="custom-select" {...props} />
);

const StyledSelect = styled(BaseSelect)`
  .custom-select__control {
    background-color: #fff8e7;
    border: 1.5px solid #facc15;
    border-radius: 8px;
    padding: 4px;
    font-size: 16px;
  }
  .custom-select__menu {
    background-color: #fff8e7;
    border-radius: 8px;
  }
  .custom-select__option--is-focused {
    background-color: #fef9c3;
  }
  .custom-select__option--is-selected {
    background-color: #fde047;
    color: black;
  }
  .custom-select__single-value {
    color: #333;
  }
`;
