import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { PetForm } from '@/types/form';

const initialState: PetForm = {
  name: '',
  species: '강아지',
  gender: '남아',
  birthDate: new Date(),
};

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    setPetForm: (state, action: PayloadAction<PetForm>) => {
      state.name = action.payload.name;
      state.species = action.payload.species;
      state.gender = action.payload.gender;
      state.birthDate = action.payload.birthDate;
    },
    resetPetForm: state => {
      state.name = initialState.name;
      state.species = initialState.species;
      state.gender = initialState.gender;
      state.birthDate = initialState.birthDate;
    },
  },
});

export const { setPetForm, resetPetForm } = petSlice.actions;
export default petSlice.reducer;
