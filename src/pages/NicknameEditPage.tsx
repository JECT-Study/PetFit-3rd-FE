import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { editNickname } from '@/apis/auth';
import { FormInput } from '@/components/common/FormInput';
import { TitleHeader } from '@/components/common/TitleHeader';
import type { AppDispatch, RootState } from '@/store';
import { setUser } from '@/store/userSlice';

export const NicknameEditPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);

  const [nickname, setNickname] = useState(user.nickname ?? '');
  const [isValid, setIsValid] = useState(false);
  const isDisabled = !nickname.trim() || !isValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSave = async () => {
    if (!isValid || !nickname.trim()) return;
    if (user.userId === null) {
      alert('유저 정보가 올바르지 않습니다.');
      return;
    }
    await editNickname(user.userId, nickname);
    dispatch(setUser({ ...user, nickname }));
    navigate(-1);
  };
  return (
    <div>
      <TitleHeader
        title="마이페이지"
        showBack={true}
        right={
          <SaveButton disabled={isDisabled} onClick={handleSave}>
            저장
          </SaveButton>
        }
      />
      <InputContainer>
        <FormInput
          label="닉네임"
          value={nickname}
          onChange={handleChange}
          validationType="nickname"
          onFieldValidChange={setIsValid}
          placeholder="닉네임을 입력하세요"
        />
      </InputContainer>
    </div>
  );
};

const SaveButton = styled.button`
  white-space: nowrap;
  font-size: 14px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const InputContainer = styled.div`
  margin: 20px;
`;
