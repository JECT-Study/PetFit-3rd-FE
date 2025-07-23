import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PetState {
  selectedPetId: number | null;
}

const initialState: PetState = {
  selectedPetId: null,
};

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    setSelectedPetId: (state, action: PayloadAction<number>) => {
      state.selectedPetId = action.payload;
    },
  },
});

export const { setSelectedPetId } = petSlice.actions;
export default petSlice.reducer;
