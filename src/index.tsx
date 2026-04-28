import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import './index.css';

const ToastContainer = lazy(() =>
  import('./components/common/ToastContainer').then(module => ({ default: module.ToastContainer }))
);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
          <Suspense fallback={null}>
            <ToastContainer />
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
