import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FormEvent, useContext, useState } from 'react';
import { Typography } from '@mui/material';
import { UserContext } from 'routes/Root';
import { AxiosQuery } from 'api';
import { LoginDTO, UserDTO } from 'api/axios-client';
import { TailSpin } from 'react-loader-spinner';

export interface Props {
  handleRegisterClick(): void;
}

export default function LoginForm({ handleRegisterClick }: Props) {
  const [statusText, setStatusText] = useState<string | undefined>(undefined);
  const [sucessfullLogin, setSucessfullLogin] = useState<boolean>(false);
  const userContext = useContext(UserContext);

  const loginMutation = AxiosQuery.Query.useLoginMutation();
  const getCurrentUser = AxiosQuery.Query.useMeQuery({
    enabled: false,
    onSuccess: (result) => {
      const user = result;
      setTimeout(() => {
        userContext?.setUser(
          new UserDTO({
            email: user.email,
            id: user.id,
            initials: user.initials,
            name: user.name,
            roles: user.roles,
          }),
        );
      }, 500);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusText(undefined);
    const data = new FormData(event.currentTarget);
    const password = data.get('password')!.toString();
    const email = data.get('email')!.toString();
    loginMutation.mutateAsync(new LoginDTO({ email, password }), {
      onSuccess: async (result) => {
        localStorage.setItem('token', result);
        setStatusText('Přihlášení proběhlo úspěšně 🤗');
        setSucessfullLogin(true);
        getCurrentUser.refetch();
      },
      onError: () => {
        setStatusText('Email nebo heslo nemáme bohužel v databázi 😥');
        setSucessfullLogin(false);
      },
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        pb={2}
      >
        <Typography variant="subtitle1" color={sucessfullLogin ? 'primary' : 'error'}>
          {statusText}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Heslo"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Přihlásit
            {loginMutation.isLoading && (
              <TailSpin
                height="25"
                width="25"
                color="white"
                ariaLabel="tail-spin-loading"
                radius="2"
                wrapperStyle={{}}
                wrapperClass=""
              />
            )}
          </Button>
          <Grid container justifyContent="end">
            <Grid item>
              <Button onClick={handleRegisterClick}>
                <Typography variant="body2">Registrovat se</Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
