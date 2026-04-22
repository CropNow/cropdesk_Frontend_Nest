import React from 'react';
import './index.css';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';

render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <App />
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
