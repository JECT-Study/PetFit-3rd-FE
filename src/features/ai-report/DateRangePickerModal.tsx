import { useState } from 'react';
import styled from 'styled-components';
import { CustomDateRangePicker } from '@/components/CustomDateRangePicker';
import { tx } from '@/styles/typography';
import { BaseModal } from '@/components/common/BaseModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DateRangePickerModal = ({ isOpen, onClose }: Props) => {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <Header>
        <h2>AI 진단받기</h2>
        <Close onClick={onClose}>✕</Close>
      </Header>

      <PickerWrapper>
        <CustomDateRangePicker
          fieldLabel="기간"
          startDate={range.startDate}
          endDate={range.endDate}
          onChange={setRange}
          withYearSelect
        />
      </PickerWrapper>

      <SubmitButton
        disabled={!range.startDate || !range.endDate}
        onClick={() => {
          onClose();
        }}
      >
        진단하기
      </SubmitButton>
    </BaseModal>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;

  h2 {
    flex: 1;
    text-align: center;
    ${tx.title('semi18')}
  }
`;

const Close = styled.button`
  font-size: 20px;
`;

const PickerWrapper = styled.div`
  margin-top: 12px;
`;

const SubmitButton = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 56px;
  ${tx.title('semi18')};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.color.main[500]};
  color: ${({ theme }) => theme.color.gray[700]};

  &:disabled {
    background-color: ${({ theme }) => theme.color.gray[100]};
    color: ${({ theme }) => theme.color.gray[400]};
  }
`;
