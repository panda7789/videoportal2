import React, { useCallback } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Box, Typography } from '@mui/material';

const Logo = () => {
  const onClickHandler = useCallback(() => {
    // TODO
    console.log('kliknuto');
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        height: '48px',
        width: '80px',
        pl: 1,
      }}
      onClick={onClickHandler}
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
};
export default Logo;
