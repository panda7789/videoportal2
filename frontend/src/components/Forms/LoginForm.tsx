import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FormEvent, useContext, useState } from 'react';
import { Typography } from '@mui/material';
import { UserContext } from 'routes/Root';
import { Privileges } from 'model/User';
import { AxiosQuery } from 'api';
import { LoginDTO } from 'api/axios-client';

export default function LoginForm() {
  const [statusText, setStatusText] = useState<string | undefined>(undefined);
  const [sucessfullLogin, setSucessfullLogin] = useState<boolean>(false);
  const userContext = useContext(UserContext);

  const loginMutation = AxiosQuery.Query.useLoginMutation();

  //

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // todo fetch login
    const password = data.get('password')?.toString();
    const email = data.get('email')?.toString();
    console.log({
      email,
      password,
    });
    loginMutation.mutateAsync(new LoginDTO({ username: email, password }), {
      onSuccess: (result) => {
        setStatusText('Přihlášení proběhlo úspěšně 🤗');
        setSucessfullLogin(true);
        setTimeout(() => {
          userContext?.setUser({
            email: 'asdf',
            id: 'asdf',
            initials: 'LL',
            name: 'name',
            rights: Privileges.user,
          });
        }, 1500);
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
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Zapomenuté heslo
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                Registrace
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
