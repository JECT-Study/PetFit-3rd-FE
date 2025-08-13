import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { router } from './routes/Router';
import { setSelectedPetId } from './store/petSlice';
import { setMemberId } from './store/userSlice';

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
    <>
      <AppInitializer />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
