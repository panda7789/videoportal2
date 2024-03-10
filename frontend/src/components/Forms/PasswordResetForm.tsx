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
import { useResetPasswordMutation } from 'api/axios-client/Query';

export interface Props {
  handleRegisterClick(): void;
  handleLoginClick(): void;
}

export default function PasswordResetForm({ handleRegisterClick, handleLoginClick }: Props) {
  const [statusText, setStatusText] = useState<string | undefined>(undefined);
  const [sucessfullLogin, setSucessfullLogin] = useState<boolean>(false);
  const mutation = useResetPasswordMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusText(undefined);
    const data = new FormData(event.currentTarget);
    const email = data.get('email')!.toString();
    mutation.mutateAsync(email, {
      onSuccess: () => {
        setStatusText('Reset hesla proběhl úspěšně.');
        setSucessfullLogin(true);
      },
      onError: () => {
        setStatusText('Reset hesla skončil chybou.');
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Obnovit heslo
            {mutation.isLoading && (
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
