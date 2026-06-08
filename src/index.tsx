import React from 'react';
import './index.css';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FontScaleProvider } from './contexts/FontScaleContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/common/ToastContainer';

render(
  <BrowserRouter>
    <ThemeProvider>
      <FontScaleProvider>
        <SidebarProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </SidebarProvider>
      </FontScaleProvider>
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
