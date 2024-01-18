/* eslint-disable no-param-reassign */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'react-aspect-ratio/aspect-ratio.css';
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import axios from 'axios';
import { AxiosQuery } from './api';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
const queryClient = new QueryClient();

onlineManager.setOnline(true);
AxiosQuery.setBaseUrl(`${import.meta.env.VITE_API_URL}`);
AxiosQuery.setAxiosFactory(() => {
  const instance = axios.create();
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.beforeRedirect = (opts) => {
          opts.headers = {
            Authorization: `Bearer ${token}`,
          };
        };
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
