import { useRouteError } from 'react-router-dom';
import { Typography, Container, Box } from '@mui/material';

export default function ErrorPage() {
  const error = useRouteError() as any;
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={10}
        mb={10}
        p={4}
        bgcolor="#f8f8f8"
        borderRadius={10}
        boxShadow={3}
      >
        <img
          src="https://robohash.org/error%20page"
          alt="Funny Error Illustration"
          style={{ width: '200px' }}
        />

        <Typography variant="h2" component="h1" align="center" gutterBottom>
          {(error as any).status ?? ''} - Ups! 😥
        </Typography>

        <Typography variant="h6" component="h2" align="center" gutterBottom>
          {error?.message ?? error?.detail}
        </Typography>
      </Box>
    </Container>
  );
}
