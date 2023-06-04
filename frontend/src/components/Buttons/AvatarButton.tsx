import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { ChannelAvatar } from 'components/Avatar/ChannelAvatar';

export interface Props {
  key?: string;
  url?: string;
  image?: string;
  text?: string;
  customAvatarText?: string;
}

export function AvatarButton({ key, url, image, text, customAvatarText }: Props) {
  return (
    <Box
      key={key}
      display="flex"
      alignItems="center"
      component={url ? Link : Box}
      to={url ?? undefined}
      padding="4px !important"
      sx={{
        textDecoration: 'none',
        color: 'unset',
        ...(url && {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }),
        borderRadius: '15px',
      }}
    >
      <ChannelAvatar imageSrc={image} avatarInitials={customAvatarText ?? text} large />
      <Typography paddingLeft={1}>{text}</Typography>
    </Box>
  );
}
