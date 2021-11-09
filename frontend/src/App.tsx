import React from 'react';
import './App.css';
import { Box, ThemeProvider } from '@mui/material';
import Logo from './components/menu/Logo';
import Avatar from './components/menu/Avatar';
import Search from './components/menu/Search';
import Theme from './Theme';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Box
        sx={{
          backgroundColor: 'primary.main',
          display: 'flex',
          justifyContent: 'space-between',
          gap: [1, 0],
        }}
      >
        <Logo />
        <Search />
        <Avatar inicials="LL" />
      </Box>
    </ThemeProvider>
  );
}

export default App;
