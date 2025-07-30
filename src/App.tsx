import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { router } from './routes/Router';
import { setSelectedPetId } from './store/petSlice';

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedId = localStorage.getItem('selectedPetId');
    if (storedId) {
      dispatch(setSelectedPetId(Number(storedId)));
    }
  }, [dispatch]);

  return null;
};

const App = () => {
  return (
    <>
      <AppInitializer />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
