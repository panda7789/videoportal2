import { Box, Toolbar, Typography } from '@mui/material';
import React, { useContext } from 'react';
import NavigationContext from '../Navigation/NavigationContext';
import HomePage from './HomePage';
import MyPortal from './MyPortal';
import Subjects from './Subjects';

const renderPage = (actualPage: number) => {
  switch (actualPage) {
    case 0:
      return <HomePage />;
    case 1:
      return <Subjects />;
    case 2:
      return <MyPortal />;
    default:
      return <Typography>Page not found :(</Typography>;
  }
};

const Pages = () => {
  const { actualPage } = useContext(NavigationContext);
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
      <Toolbar />
      <Box>{renderPage(actualPage)}</Box>
    </Box>
  );
};

export default Pages;