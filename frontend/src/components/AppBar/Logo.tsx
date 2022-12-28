import React, { useContext } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
// eslint-disable-next-line import/no-cycle
import { NavigationContext } from 'routes/Root';

function Logo() {
  const context = useContext(NavigationContext);

  const handleClick = () => {
    context?.setOpen(true);
  };
   
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
      onClick={() => handleClick()}
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
