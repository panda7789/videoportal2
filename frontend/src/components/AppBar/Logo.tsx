import React, { useCallback, useContext } from 'react';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import NavigationContext from 'components/Navigation/NavigationContext';

function Logo() {
  const { setActualPage } = useContext(NavigationContext);

  const onClickHandler = useCallback(() => {
    setActualPage(0);
  }, []);

  return (
    <Link to="/">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          height: '48px',
          width: '80px',
          pl: 1,
          cursor: 'pointer',
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
    </Link>
  );
}
export default Logo;
