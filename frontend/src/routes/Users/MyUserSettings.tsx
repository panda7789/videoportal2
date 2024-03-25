import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextField, Button, Box, Grid, Typography, Alert } from '@mui/material';
import { AxiosQuery } from 'api';
import { User, UserRoles } from 'model/User';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import { useResetPasswordMutation, useUsersPUTMutation } from 'api/axios-client/Query';
import { useLoaderData, useNavigate } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Route } from 'routes/RouteNames';
import { UserContext } from 'routes/Root';

export const loader = () => {
  return AxiosQuery.Client.me();
};

export function MyUserSettings() {
  let updateUserMutation: ReturnType<typeof useUsersPUTMutation> | undefined;
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState<string>();
  const user = useLoaderData() as User;
  const passwordResetMutation = useResetPasswordMutation();
  const userContext = useContext(UserContext);

  if (user) {
    updateUserMutation = useUsersPUTMutation(user.id);
  }

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const adminRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event.currentTarget.name === 'Cancel') {
      return;
    }
    event.preventDefault();
    setStatusText(undefined);
    const updatedUser = new User({
      id: user?.id,
      name: nameRef.current!.value,
      email: emailRef.current!.value,
      initials: '',
      roles: new UserRoles({
        administrator: adminRef.current!.checked,
        videoEditor: editorRef.current!.checked,
        user: viewerRef.current!.checked,
      }),
    });
    updateUserMutation?.mutateAsync(updatedUser, {
      onSuccess: () => {
        setStatusText('Uživatel byl úspěšně upraven');
        setTimeout(() => navigate(`/${Route.users}/`), 300);
      },
      onError: () => {
        setStatusText('Nepodařilo se upravit uživatele');
      },
    });
  };

  const handleRevertChanges = async () => {
    navigate(0);
  };

  const onKeyDown = (keyEvent: React.KeyboardEvent<HTMLFormElement>) => {
    if (keyEvent.code === 'Enter') {
      keyEvent.preventDefault();
    }
  };

  const handlePasswordResetClick = () => {
    setStatusText(undefined);
    passwordResetMutation.mutateAsync(user.email, {
      onSuccess: () => {
        setStatusText('Reset hesla proběhl úspěšně. Na Váš email dorazí další informace.');
      },
      onError: () => {
        setStatusText('Reset hesla skončil chybou.');
      },
    });
  };

  useEffect(() => {
    if (!userContext?.isLoading && !userContext?.user) throw new Error('Nejste přihlášení.');
  }, [userContext?.user, userContext?.isLoading]);

  return (
    <Box margin={4} component="form" onSubmit={handleSubmit} onKeyDown={onKeyDown}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Editace uživatele
        </Typography>
        <Box gap={2} display="flex">
          <Button
            variant="outlined"
            onClick={handleRevertChanges}
            startIcon={<RestoreIcon />}
            type="submit"
          >
            Zahodit změny
          </Button>
          <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
            Uložit
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {statusText && <Alert severity="info">{statusText}</Alert>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3} paddingTop={3}>
            <Grid item xs={12}>
              <TextField
                label="Jméno"
                defaultValue={user?.name}
                inputRef={nameRef}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                defaultValue={user?.email}
                inputRef={emailRef}
                required
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                onClick={handlePasswordResetClick}
                startIcon={<LockResetIcon />}
              >
                Resetovat heslo
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
