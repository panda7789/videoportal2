import React, { useMemo, useState } from 'react';
import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import AppBarModified from 'components/AppBar/AppBar';
import Navigation from 'components/Navigation/Navigation';
import { Outlet, useNavigation } from 'react-router-dom';
import theme from 'Theme';

interface NavigationContextInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavigationContext = React.createContext<NavigationContextInterface | null>(null);

export default function Root() {
  const navigation = useNavigation();
  const [navigationOpen, setNavigationOpen] = useState(true);
    
  const navigationContextMemo = useMemo<NavigationContextInterface>(() => ({
    open: navigationOpen,
    setOpen: setNavigationOpen
}),[navigationOpen,setNavigationOpen]);



  return (
        <NavigationContext.Provider value={navigationContextMemo}>
      <AppBarModified />
      <Box padding={{ xs: 0, md: '16px 24px 24px 24px' }} width="100%">
        <Toolbar />
        <Navigation/>
        <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Box
            id="detail"
            className={navigation.state === 'loading' ? 'loading' : ''}
            sx={{
              p: { xs: 0, md: '0 0 0 256px' },
              ...(!navigationOpen && {
                p: { xs: 0, md: `0 0 0 calc(${theme.spacing(7)} - 1px)` },
                width: `calc(100% - ${theme.spacing(7)} + 1px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              })
            }}
          >
                <Outlet />
          </Box>
        </Box>
      </Box>
        </NavigationContext.Provider>
  );
}
