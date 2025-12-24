import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import App from '@/app/App';
import { AppProviders } from '@/app/providers';
import { queryClient } from '@/services/queryClient';

import '@/styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProviders>
          <App />
        </AppProviders>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
