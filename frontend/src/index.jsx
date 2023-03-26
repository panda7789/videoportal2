import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'react-aspect-ratio/aspect-ratio.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosQuery } from 'api';
import axios from 'axios';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
const queryClient = new QueryClient();

AxiosQuery.setBaseUrl('https://localhost:7287');
AxiosQuery.setAxiosFactory(() => {
  const instance = axios.create();
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');

      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  return instance;
});

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
