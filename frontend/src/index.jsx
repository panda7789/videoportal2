import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'react-aspect-ratio/aspect-ratio.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosQuery } from 'api';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
const queryClient = new QueryClient();

AxiosQuery.setBaseUrl('https://localhost:7287');

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
