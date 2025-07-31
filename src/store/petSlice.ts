import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SelectedPetState {
  id: number | null;
  name: string;
  species: string;
  gender: string;
  birthDate: Date;
}

// ✅ id만 localStorage에서 불러오기
const loadSelectedPetId = (): number | null => {
  const stored = localStorage.getItem('selectedPetId');
  return stored ? Number(stored) : null;
};

const initialState: SelectedPetState = {
  id: loadSelectedPetId(),
  name: '',
  species: '강아지',
  gender: '남아',
  birthDate: new Date(),
};

const petSlice = createSlice({
  name: 'selectedPet',
  initialState,
  reducers: {
    setSelectedPet: (_, action: PayloadAction<SelectedPetState>) => {
      return { ...action.payload };
    },
    resetSelectedPet: () => {
      localStorage.removeItem('selectedPetId');
      return {
        id: null,
        name: '',
        species: '강아지',
        gender: '남아',
        birthDate: new Date(),
      };
    },
    // ✅ 전용 id 저장 리듀서
    setSelectedPetId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
      localStorage.setItem('selectedPetId', String(action.payload));
    },
  },
});

export const { setSelectedPet, resetSelectedPet, setSelectedPetId } = petSlice.actions;
export default petSlice.reducer;
