import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { router } from './routes/Router';
import { setSelectedPetId } from './store/petSlice';
import { setMemberId } from './store/userSlice';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedMemberId = localStorage.getItem('memberId');
    if (storedMemberId) {
      dispatch(setMemberId(Number(storedMemberId)));
    }

    const storedPetId = localStorage.getItem('selectedPetId');
    if (storedPetId) {
      dispatch(setSelectedPetId(Number(storedPetId)));
    }
  }, [dispatch]);

  return null;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppInitializer />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
