import React from 'react';
import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import AppBarModified from 'components/AppBar/AppBar';
import Navigation from 'components/Navigation/Navigation';
import { Outlet } from 'react-router-dom';


export default function Root() {
  return (
    <>
      <AppBarModified />
      <Box padding={{ xs: 0, md: '16px 24px 24px 24px' }} width="100%">
        <Toolbar />
        <Navigation />
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Box padding={{ xs: 0, md: '0 0 0 256px' }}>
            <Outlet />
          </Box>
        </Box>
        
      </Box>
    </>
  )
}

