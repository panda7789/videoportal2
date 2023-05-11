import { Avatar } from '@mui/material';
import { ApiPath } from 'components/Utils/APIUtils';
import { GetInitials } from 'components/Utils/StringUtils';

export interface Props {
  imageSrc?: string;
  avatarInitials?: string;
  large?: boolean;
}

export function ChannelAvatar({ imageSrc, avatarInitials, large = false }: Props) {
  return (
    <Avatar
      sx={{
        width: large ? 48 : 24,
        height: large ? 48 : 24,
        border: '0.1px solid lightgray',
        padding: '4px',
        img: { objectFit: 'fill', borderRadius: '50%' },
      }}
      src={imageSrc}
    >
      {!imageSrc ? GetInitials(avatarInitials) : ''}
    </Avatar>
  );
}
