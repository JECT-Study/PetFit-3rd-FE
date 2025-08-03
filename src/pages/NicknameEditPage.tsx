import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { editNickname, getNickname } from '@/apis/auth';
import { FormInput } from '@/components/common/FormInput';
import { TitleHeader } from '@/components/common/TitleHeader';
import type { AppDispatch, RootState } from '@/store/store';
import { setUser } from '@/store/userSlice';

export const NicknameEditPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // redux에서 닉네임을 가져오는 부분인데, 현재는 적용 안되고 있음
  const user = useSelector((state: RootState) => state.user);

  // redux에 저장된 nickname을 가져오는 로직으로 바뀔 수 있음
  // 임의로 memberId = 2 로 요청 보냄
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getNickname(2),
  });

  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(false);
  const isDisabled = !nickname.trim() || !isValid;

  useEffect(() => {
    if (userInfo?.nickname) {
      setNickname(userInfo.nickname);
    }
  }, [userInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSave = async () => {
    if (!isValid || !nickname.trim()) return;

    await editNickname(2, nickname);
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
