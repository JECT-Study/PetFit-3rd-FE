import { ko } from 'date-fns/locale';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

type CustomDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const CustomDatePicker = ({ value, onChange, placeholder }: CustomDatePickerProps) => {
  const dateValue = value ? new Date(value) : null;

  return (
    <StyledDatePicker
      locale={ko}
      selected={dateValue}
      onChange={(date: Date | null) => date && onChange(date.toISOString().slice(0, 10))}
      dateFormat="yyyy년 MM월 dd일"
      placeholderText={placeholder ?? '날짜를 선택하세요'}
      popperPlacement="bottom-start"
    />
  );
};

// Forware Ref 패턴?
const BaseDatePicker = (props: React.ComponentProps<typeof ReactDatePicker>) => (
  <ReactDatePicker {...props} />
);

const StyledDatePicker = styled(BaseDatePicker)`
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  background-color: #fff8e7;
  border: 1.5px solid #facc15;
  border-radius: 8px;
  color: #333;

  .react-datepicker__day--selected {
    background-color: #f59e0b;
    color: white;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: #facc15;
  }

  .react-datepicker__header {
    background-color: #fff8e7;
    border-bottom: none;
  }
`;
