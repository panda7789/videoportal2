import React from 'react';
import { Avatar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

export interface Props {
  key: string;
  url: string;
  image?: string;
  text: string;
}

export function AvatarButton({ key, url, image, text }: Props) {
  return (
    <Box
      key={key}
      display="flex"
      alignItems="center"
      component={Link}
      to={url}
      padding="4px !important"
      sx={{
        textDecoration: 'none',
        color: 'unset',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        borderRadius: '15px',
      }}
    >
      <Avatar
        sx={{
          width: 48,
          height: 48,
          border: '0.1px solid lightgray',
          padding: '4px',
          img: { objectFit: 'fill', borderRadius: '50%' },
        }}
        src={image}
      />
      <Typography paddingLeft={1}>{text}</Typography>
    </Box>
  );
}
