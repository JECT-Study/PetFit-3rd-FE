import meal from '@/assets/icons/meal.svg';
import poop from '@/assets/icons/poop.svg';
import skin from '@/assets/icons/skin.svg';
import teeth from '@/assets/icons/teeth.svg';
import walk from '@/assets/icons/walk.svg';
import water from '@/assets/icons/water.svg';

export const SLOT_ITEMS = [
  { id: 'meal', label: '사료', icon: meal },
  { id: 'water', label: '음수', icon: water },
  { id: 'poop', label: '배변', icon: poop },
  { id: 'walk', label: '산책', icon: walk },
  { id: 'teeth', label: '치아', icon: teeth },
  { id: 'skin', label: '피부, 털', icon: skin },
] as const;
