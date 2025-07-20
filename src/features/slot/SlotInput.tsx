import { useEffect, useState } from 'react';

import { Menu } from 'lucide-react';
import styled from 'styled-components';

import { SLOT_ITEMS } from '@/constants/slot';

import { NonUnitModal } from './NonUnitModal';

interface Props {
  selectedIds: string[];
  mode: 'register' | 'edit';
  defaultValues?: Record<string, number>;
}

export const SlotInput = ({ selectedIds, mode, defaultValues = {} }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  // ✅ selectedIds가 바뀌거나 mode/edit defaultValues가 바뀔 때 input 초기화
  useEffect(() => {
    const init: Record<string, string> = {};
    selectedIds.forEach(id => {
      init[id] = mode === 'edit' ? String(defaultValues[id] ?? '') : '';
    });
    setValues(init);
  }, [selectedIds, defaultValues, mode]);

  const handleChange = (id: string, value: string) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleClickNonUnit = () => setIsModalOpen(true);
  return (
    <div>
      {SLOT_ITEMS.filter(({ id }) => selectedIds.includes(id)).map(
        ({ id, Icon, label, unit, placeholder }) => (
          <InputContainer key={id}>
            <InputHeader>
              <InputTitle>
                <Icon width={16} color="#4D9DE0" /> {label}
              </InputTitle>
              {unit ? <InputSubtitle>(단위: {unit})</InputSubtitle> : null}
            </InputHeader>
            <InputContent>
              {unit ? (
                <Input
                  placeholder={placeholder}
                  value={values[id] ?? ''}
                  onChange={e => handleChange(id, e.target.value)}
                />
              ) : (
                <NonUnitInput onClick={handleClickNonUnit}>{placeholder}</NonUnitInput>
              )}

              <Menu color={'#A5A5A5'} />
            </InputContent>
          </InputContainer>
        )
      )}

      <NonUnitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const InputContainer = styled.div`
  margin: 10px 0;
  border-bottom: 1px solid #e0e0e0;
`;

const InputHeader = styled.div`
  display: flex;
  gap: 5px;
  font-size: 12px;
`;

const InputTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const InputSubtitle = styled.div`
  color: gray;
`;

const InputContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  width: calc(100%);
  height: 45px;
  margin: 12px 0px;
  padding: 12px 20px;

  font-size: 14px;
  background: #fff8e5;
  border: 1px solid #dddddd;
  border-radius: 8px;
`;

const NonUnitInput = styled.div`
  width: 100%;
  height: 45px;
  margin: 12px 0px;
  padding: 12px 20px;
  font-size: 14px;
  color: #a5a5a5;
  background: #f8f8f8;
  border: 1px solid #dddddd;
  border-radius: 8px;
  cursor: pointer;
`;
