import React, { Suspense, lazy } from 'react';
import './index.css';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';

const ToastContainer = lazy(() =>
  import('./components/common/ToastContainer').then(module => ({ default: module.ToastContainer }))
);

render(
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
  document.getElementById('root'),
);
