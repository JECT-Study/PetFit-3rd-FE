import Meal from '@/assets/icons/meal.svg?react';
import Poop from '@/assets/icons/poop.svg?react';
import Skin from '@/assets/icons/skin.svg?react';
import Teeth from '@/assets/icons/teeth.svg?react';
import Walk from '@/assets/icons/walk.svg?react';
import Water from '@/assets/icons/water.svg?react';

export const SLOT_ITEMS = [
  {
    id: 'meal',
    label: '사료',
    Icon: Meal,
    unit: 'g',
    placeholder: '정해진 하루 사료의 양을 입력해주세요.',
  },
  {
    id: 'water',
    label: '음수',
    Icon: Water,
    unit: 'ml',
    placeholder: '정해진 하루 음수량을 입력해주세요.',
  },
  {
    id: 'poop',
    label: '배변',
    Icon: Poop,
    unit: '회',
    placeholder: '정해진 하루 산책시간을 입력해주세요.',
  },
  { id: 'walk', label: '산책', Icon: Walk, unit: null, placeholder: '이상 없음' },
  { id: 'teeth', label: '치아', Icon: Teeth, unit: null, placeholder: '이상 없음' },
  { id: 'skin', label: '피부, 털', Icon: Skin, unit: null, placeholder: '이상 없음' },
] as const;
