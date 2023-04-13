import React from 'react';
import { Avatar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { GetInitials } from 'components/Utils/StringUtils';
import { ChannelAvatar } from 'components/Avatar/ChannelAvatar';

export interface Props {
  key?: string;
  url?: string;
  image?: string;
  text?: string;
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
      <ChannelAvatar imageSrc={image} avatarInitials={text} large />
      <Typography paddingLeft={1}>{text}</Typography>
    </Box>
  );
}
