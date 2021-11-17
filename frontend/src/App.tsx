import { Box, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import './App.css';
import AppBarModified from './components/AppBar/AppBar';
import Navigation from './components/Navigation/Navigation';
import NavigationContext from './components/Navigation/NavigationContext';
import Pages from './components/Pages/Pages';
import Theme from './Theme';

function App() {
  const [actualPage, setActualPage] = useState(0);
  const setPage = (value: number) => {
    setActualPage(value);
  };
  return (
    <ThemeProvider theme={Theme}>
      <NavigationContext.Provider value={{ actualPage, setActualPage: setPage }}>
        <Box sx={{ display: 'flex' }}>
          <AppBarModified />
          <Navigation />
          <Pages />
        </Box>
      </NavigationContext.Provider>
    </ThemeProvider>
  );
}

export default App;
