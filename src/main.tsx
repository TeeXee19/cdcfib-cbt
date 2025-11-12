import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <Toaster />
    <App />
  </StrictMode>,
)
