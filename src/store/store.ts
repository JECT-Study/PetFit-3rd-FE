import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import calendarReducer from './calendarSlice';
import petReducer from './petSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    selectedPet: petReducer,
    user: userReducer,
    calendar: calendarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
