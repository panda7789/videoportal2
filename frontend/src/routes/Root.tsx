import React, { useEffect, useMemo, useState } from 'react';
import { Snackbar, Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import AppBarModified from 'components/AppBar/AppBar';
import Navigation from 'components/Navigation/Navigation';
import { Outlet, useNavigation } from 'react-router-dom';
import theme from 'Theme';
import { UserDTO as User, UserDTO } from 'api/axios-client';
import { AxiosQuery } from 'api';
import { useQueryClient } from '@tanstack/react-query';

interface NavigationContextInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserContextInterface {
  isLoading: boolean;
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

interface SnackBarContextInterface {
  showText(text: string): void;
}

export const NavigationContext = React.createContext<NavigationContextInterface | null>(null);
export const UserContext = React.createContext<UserContextInterface | null>(null);
export const SnackbarContext = React.createContext<SnackBarContextInterface | null>(null);

export default function Root() {
  const navigation = useNavigation();
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [user, setUser] = useState<User | undefined>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const getCurrentUser = AxiosQuery.Query.useMeQuery({
    enabled: false,
    onSuccess: (result) => {
      setUser(
        new UserDTO({
          email: result.email,
          id: result.id,
          initials: result.initials,
          name: result.name,
          roles: result.roles,
        }),
      );
      setIsLoading(false);
      queryClient.invalidateQueries();
    },
    onError: () => {
      setUser(undefined);
      localStorage.removeItem('token');
      setIsLoading(false);
      queryClient.invalidateQueries();
      // tyhle invaldiace se musí přenéíst do odhlášení
    },
  });

  const userContextMemo = useMemo<UserContextInterface>(
    () => ({
      isLoading,
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

  const snackBarContextMemo = useMemo<SnackBarContextInterface>(
    () => ({
      showText: (text) => {
        setSnackbarText(text);
        setSnackbarOpen(true);
      },
    }),
    [],
  );
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (!user && localStorage.getItem('token')) {
      setIsLoading(true);
      getCurrentUser.refetch();
    }
  }, [user]);

  return (
    <NavigationContext.Provider value={navigationContextMemo}>
      <UserContext.Provider value={userContextMemo}>
        <SnackbarContext.Provider value={snackBarContextMemo}>
          <AppBarModified />
          <Box padding={{ xs: 0, md: 0 }} width="100%">
            <Toolbar />
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <Box
                id="detail"
                className={navigation.state === 'loading' ? 'loading' : ''}
                sx={{
                  p: { xs: 0, md: '0 0 0 256px' },
                  ...(!navigationOpen && {
                    p: { xs: 0, md: `0 0 0 calc(${theme.spacing(7)} - 1px)` },
                    width: { xs: '100%', md: `calc(100% - ${theme.spacing(7)} + 1px)` },
                    transition: theme.transitions.create(['width', 'margin'], {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                  }),
                }}
              >
                <Outlet />
              </Box>
              <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                autoHideDuration={4000}
                message={snackbarText}
              />
            </Box>
          </Box>
        </SnackbarContext.Provider>
      </UserContext.Provider>
    </NavigationContext.Provider>
  );
}
