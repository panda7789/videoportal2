import { Box, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AppBarModified from './components/AppBar/AppBar';
import Navigation from './components/Navigation/Navigation';
import NavigationContext from './components/Navigation/NavigationContext';
import Pages from './components/Pages/Pages';
import VideoDetail from './routes/VideoDetail';
import Theme from './Theme';

function App() {
  const [actualPage, setActualPage] = useState(0);
  const setPage = (value: number) => {
    setActualPage(value);
  };
  return (
    <ThemeProvider theme={Theme}>
      <Box sx={{ display: 'flex' }}>
        <AppBarModified />
        <Box padding={{ xs: 0, md: '16px 24px 24px 24px' }}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <NavigationContext.Provider value={{ actualPage, setActualPage: setPage }}>
                    <Navigation />
                    <Pages />
                  </NavigationContext.Provider>
                }
              />
              <Route path="video" element={<VideoDetail />} />
            </Routes>
          </BrowserRouter>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
