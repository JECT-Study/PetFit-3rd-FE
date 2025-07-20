import { useState } from 'react';

import styled from 'styled-components';

import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';
import { ScheduleAlarmItem } from '@/features/alarm/ScheduleAlarmItem';
import { ScheduleRegisterModal } from '@/features/alarm/ScheduleRegisterModal';
import { useModal } from '@/hooks/useModal';
import type { Alarm } from '@/types/alarm';

import EmptyDog from '@/assets/icons/empty-dog.svg?react';

const createEmptyAlarm = (): Alarm => ({
  id: Date.now(),
  startDate: new Date(),
  title: '',
  description: '',
});

export const AlarmPage = () => {
  const { isOpen, openModal, closeModal } = useModal();

  const [alarmList, setAlarmList] = useState<Alarm[]>([]);
  const [editingAlarm, setEditingAlarm] = useState<Alarm>(createEmptyAlarm());
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const isEditing = (list: Alarm[], target: Alarm) => list.some(alarm => alarm.id === target.id);

  const addOrUpdateAlarmList = (list: Alarm[], target: Alarm): Alarm[] =>
    isEditing(list, target)
      ? list.map(alarm => (alarm.id === target.id ? target : alarm))
      : [...list, target];

  const deleteAlarmById = (list: Alarm[], targetId: number): Alarm[] =>
    list.filter(alarm => alarm.id !== targetId);

  const handleAddAlarm = () => {
    setEditingAlarm(createEmptyAlarm());
    openModal();
  };

  const handleEdit = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    openModal();
  };

  const handleSubmit = (submittedAlarm: Alarm) => {
    setAlarmList(prev => addOrUpdateAlarmList(prev, submittedAlarm));
    closeModal();
  };

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      setAlarmList(prev => deleteAlarmById(prev, deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  return (
    <Wrapper>
      <Header>알람 설정하기</Header>

      <Content>
        {alarmList.length === 0 ? (
          <>
            <EmptyDogIcon />
            <Description>등록한 알람이 없습니다</Description>
            <AddButton onClick={handleAddAlarm}>알람 추가하기</AddButton>
          </>
        ) : (
          <>
            <AddButton hasList onClick={handleAddAlarm}>
              알람 추가하기
            </AddButton>
            <List>
              {alarmList.map(alarm => (
                <ScheduleAlarmItem
                  key={alarm.id}
                  alarm={alarm}
                  onEdit={() => handleEdit(alarm)}
                  onDelete={() => setDeleteTargetId(alarm.id)}
                />
              ))}
            </List>
          </>
        )}
      </Content>

      <ScheduleRegisterModal
        isOpen={isOpen}
        onClose={closeModal}
        initialAlarm={editingAlarm} // 추가 시엔 빈 객체, 수정 시엔 기존 알람
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Header = styled.h2`
  text-align: center;
  padding: 18px 0;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 135%;
  letter-spacing: -0.45px;
`;

const Content = styled.div`
  position: relative;
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const EmptyDogIcon = styled(EmptyDog)`
  width: 120px;
  height: auto;
`;

const Description = styled.p`
  color: #999;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
`;

const AddButton = styled.button<{ hasList?: boolean }>`
  position: ${({ hasList }) => (hasList ? 'absolute' : 'static')};
  top: ${({ hasList }) => (hasList ? '-58px' : 'auto')};
  right: ${({ hasList }) => (hasList ? '16px' : 'auto')};
  align-self: ${({ hasList }) => (hasList ? 'flex-end' : 'center')};
  margin-top: ${({ hasList }) => (hasList ? '0' : '18px')};

  padding: 8px 12px;
  background-color: #facc15;
  color: #222;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
    cursor: pointer;
  }
`;

const List = styled.ul`
  width: 100%;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
