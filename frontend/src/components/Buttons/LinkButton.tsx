import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

export interface Props {
  to: string;
  text: string;
  icon: JSX.Element;
}

export function LinkButton({ to, text, icon }: Props) {
  return (
    <Button
      sx={{ marginLeft: 2, fontSize: 11, color: 'black', borderColor: 'black' }}
      startIcon={icon}
      variant="outlined"
      component={Link}
      to={to}
    >
      {text}
    </Button>
  );
}
