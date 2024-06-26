import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Box,
  Grid,
  Typography,
  Alert,
} from '@mui/material';
import { AxiosQuery } from 'api';
import { User, UserRoles } from 'model/User';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import LockResetIcon from '@mui/icons-material/LockReset';
import {
  useRegisterMutation,
  useResetPasswordMutation,
  useUsersPUTMutation,
} from 'api/axios-client/Query';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { RegisterDTO } from 'api/axios-client';
import { Route } from 'routes/RouteNames';
import { UserContext } from 'routes/Root';

export const loader = ({ params }: { params: any }) => {
  return AxiosQuery.Client.usersGET(params.Id);
};

export interface Props {
  newUser?: boolean;
}

export function UserEditor({ newUser = false }: Props) {
  let updateUserMutation: ReturnType<typeof useUsersPUTMutation> | undefined;
  let registerMutation: ReturnType<typeof useRegisterMutation> | undefined;
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState<string>();
  const passwordResetMutation = useResetPasswordMutation();
  const userContext = useContext(UserContext);
  const user = useLoaderData() as User;
  if (newUser) {
    registerMutation = useRegisterMutation();
  }
  if (!newUser) {
    if (user) {
      updateUserMutation = useUsersPUTMutation(user.id);
    }
  }

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const adminRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event.currentTarget.name === 'Cancel') {
      return;
    }
    event.preventDefault();
    setStatusText(undefined);
    if (newUser) {
      registerMutation?.mutateAsync(
        new RegisterDTO({
          email: emailRef.current!.value,
          name: nameRef.current!.value,
          password: passwordRef.current!.value,
        }),
        {
          onSuccess: () => {
            setStatusText('Uživatel byl úspěšně vytvořen');
            setTimeout(() => navigate(`/${Route.users}/`), 300);
          },
          onError: () => {
            setStatusText('Nepodařilo se vytvořit uživatele');
          },
        },
      );
    } else {
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
    }
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
              />
            </Grid>
            {newUser && (
              <Grid item xs={12}>
                <TextField
                  label="Heslo"
                  required
                  inputRef={passwordRef}
                  type="password"
                  fullWidth
                />
              </Grid>
            )}
            {!newUser && (
              <Grid item xs={12}>
                <FormGroup
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    paddingLeft: '14px',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={user?.roles?.administrator}
                        inputRef={adminRef}
                        name="admin"
                      />
                    }
                    label="Administrator"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={user?.roles?.videoEditor}
                        inputRef={editorRef}
                        name="editor"
                      />
                    }
                    label="Video editor"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={user?.roles?.user}
                        inputRef={viewerRef}
                        name="viewer"
                      />
                    }
                    label="Uživatel"
                  />
                </FormGroup>
                <Grid item xs={6} pt={2}>
                  <Button
                    variant="outlined"
                    onClick={handlePasswordResetClick}
                    startIcon={<LockResetIcon />}
                  >
                    Resetovat heslo
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserEditor;
