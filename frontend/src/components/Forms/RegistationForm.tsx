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
import { RegisterDTO } from 'api/axios-client';
import { TailSpin } from 'react-loader-spinner';

export interface Props {
  handleLoginClick(): void;
}

export default function RegistrationForm({ handleLoginClick }: Props) {
  const [statusText, setStatusText] = useState<string | undefined>(undefined);
  const [sucessfullRegistration, setSuccessfullRegistration] = useState<boolean>(false);
  const userContext = useContext(UserContext);

  const registrationMutation = AxiosQuery.Query.useRegisterMutation();
  const getCurrentUser = AxiosQuery.Query.useMeQuery({
    enabled: false,
    onSuccess: (result) => {
      const user = result;
      setTimeout(() => {
        userContext?.setUser({
          email: user.email,
          id: user.id,
          initials: user.initials,
          name: user.name,
          rights: user.rights as unknown as Privileges,
        });
      }, 1500);
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
    const name = data.get('name')!.toString();
    registrationMutation.mutateAsync(new RegisterDTO({ email, name, password }), {
      onSuccess: (result) => {
        localStorage.setItem('token', result);
        setStatusText('Registrace proběhla úspěšně 🤗');
        setSuccessfullRegistration(true);
        getCurrentUser.refetch();
      },
      onError: (error) => {
        setStatusText((error as string).toString());
        setSuccessfullRegistration(false);
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
        <Typography variant="subtitle1" color={sucessfullRegistration ? 'primary' : 'error'}>
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
            id="name"
            label="Jméno"
            name="name"
            type="text"
            autoComplete="name"
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
            Registrovat
            {registrationMutation.isLoading && (
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
              <Button onClick={handleLoginClick}>
                <Typography variant="body2">Přihlásit se</Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
