import React, { useMemo, useState } from 'react';
import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import AppBarModified from 'components/AppBar/AppBar';
import Navigation from 'components/Navigation/Navigation';
import { Outlet, useNavigation } from 'react-router-dom';
import theme from 'Theme';
import { User } from 'model/User';

interface NavigationContextInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserContextInterface {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const NavigationContext = React.createContext<NavigationContextInterface | null>(null);
export const UserContext = React.createContext<UserContextInterface | null>(null);

export default function Root() {
  const navigation = useNavigation();
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [user, setUser] = useState<User | undefined>();

  const userContextMemo = useMemo<UserContextInterface>(
    () => ({
      user,
      setUser,
    }),
    [user, setUser],
  );

  const navigationContextMemo = useMemo<NavigationContextInterface>(
    () => ({
      open: navigationOpen,
      setOpen: setNavigationOpen,
    }),
    [navigationOpen, setNavigationOpen],
  );

  return (
    <NavigationContext.Provider value={navigationContextMemo}>
      <UserContext.Provider value={userContextMemo}>
        <AppBarModified />
        <Box padding={{ xs: 0, md: 0 }} width="100%">
          <Toolbar />
          <Navigation />
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
                }),
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </UserContext.Provider>
    </NavigationContext.Provider>
  );
}
