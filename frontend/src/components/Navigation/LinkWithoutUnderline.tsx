import React from 'react';
import { Link } from '@mui/material';

function LinkWithoutUnderline({ children }: any) {
  return <Link underline="none"> {children} </Link>;
}

export default LinkWithoutUnderline;
