import axios from 'axios';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(<App />);
