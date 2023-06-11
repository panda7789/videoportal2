import { Chip } from '@mui/material';
import { searchTagsUrl } from 'components/AppBar/Search';
import { GetRandomColor } from 'components/Utils/CoolColors';
import React from 'react';

export interface Props {
  text?: string;
  icon?: JSX.Element;
  onClick?: React.MouseEventHandler;
  onDelete?: React.MouseEventHandler;
  color?: string;
  bgColor?: string;
  active?: boolean;
  linkTo?: string;
  link?: boolean;
}

function CustomChip({
  text,
  icon,
  onClick,
  onDelete,
  color,
  bgColor,
  linkTo,
  link,
  active = false,
}: Props) {
  // eslint-disable-next-line no-param-reassign
  bgColor = bgColor ?? GetRandomColor();
  // eslint-disable-next-line no-param-reassign
  color = color ?? bgColor;
  return (
    <Chip
      key={text}
      label={text}
      icon={icon}
      variant="outlined"
      onClick={onClick}
      onDelete={onDelete}
      component="a"
      href={link ? linkTo ?? (text && searchTagsUrl([text])) : undefined}
      clickable
      sx={{
        color,
        borderColor: bgColor,
        '&:hover': {
          backgroundColor: `${bgColor}55`,
        },
        ...(active && {
          color: '#FFF',
          backgroundColor: bgColor,
          '&:hover': {
            color: bgColor,
            '& .MuiChip-deleteIcon': {
              color: '#00000042',
            },
          },
          '& .MuiChip-deleteIcon': {
            color: 'white',
          },
        }),
      }}
    />
  );
}

export default CustomChip;
