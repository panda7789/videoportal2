import React from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        height: '48px',
        width: '80px',
        pl: 1,
        cursor: 'pointer',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
        }}
      >
        VP
      </Typography>
      <PlayCircleIcon fontSize="large" />
    </Box>
  );
}
export default Logo;
