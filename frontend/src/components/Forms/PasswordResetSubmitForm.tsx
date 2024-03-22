import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { FormEvent, useState } from 'react';
import { IconButton, InputAdornment, Typography } from '@mui/material';
import { AxiosQuery } from 'api';
import { PasswordResetDTO } from 'api/axios-client';
import { TailSpin } from 'react-loader-spinner';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface Props {
  token: string;
}

export default function PasswordResetSubmitForm({ token }: Props) {
  const [statusText, setStatusText] = useState<string | undefined>(undefined);
  const [sucessfullRegistration, setSuccessfullRegistration] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const mutation = AxiosQuery.Query.useSubmitResetPasswordMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusText(undefined);
    const data = new FormData(event.currentTarget);
    const password = data.get('password')!.toString();
    const email = data.get('email')!.toString();
    if (password.length === 0 || email.length === 0) {
      setStatusText('Všechna pole musí být vyplněna');
      return;
    }
    mutation.mutateAsync(new PasswordResetDTO({ email, password, token }), {
      onSuccess: () => {
        setStatusText('Heslo bylo úspěšně změněno');
        setSuccessfullRegistration(true);
        setTimeout(() => navigate('/'), 1000);
      },
      onError: (error: any) => {
        setStatusText(`Heslo se nepodařilo změnit (${(error?.response as any)?.detail ?? ''})`);
        setSuccessfullRegistration(false);
      },
    });
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Heslo"
            type={showPassword ? 'text' : 'password'}
            id="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Nastavit nové heslo
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
        </Box>
      </Box>
    </Container>
  );
}
