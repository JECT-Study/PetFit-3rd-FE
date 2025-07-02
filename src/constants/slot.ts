import meal from '@/assets/icons/meal.svg';
import poop from '@/assets/icons/poop.svg';
import skin from '@/assets/icons/skin.svg';
import teeth from '@/assets/icons/teeth.svg';
import walk from '@/assets/icons/walk.svg';
import water from '@/assets/icons/water.svg';

export const SLOT_ITEMS = [
  {
    id: 'meal',
    label: '사료',
    icon: meal,
    unit: 'g',
    placeholder: '정해진 하루 사료의 양을 입력해주세요.',
  },
  {
    id: 'water',
    label: '음수',
    icon: water,
    unit: 'ml',
    placeholder: '정해진 하루 음수량을 입력해주세요.',
  },
  {
    id: 'poop',
    label: '배변',
    icon: poop,
    unit: '회',
    placeholder: '정해진 하루 산책시간을 입력해주세요.',
  },
  { id: 'walk', label: '산책', icon: walk, unit: 'null', placeholder: '이상 없음' },
  { id: 'teeth', label: '치아', icon: teeth, unit: null, placeholder: '이상 없음' },
  { id: 'skin', label: '피부, 털', icon: skin, unit: null, placeholder: '이상 없음' },
] as const;
