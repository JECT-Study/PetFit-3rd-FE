import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import { store } from '@/stores/index.ts';

import App from './App.tsx';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
