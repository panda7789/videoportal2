import { Box, Chip } from '@mui/material';
import { searchTagsUrl } from 'components/AppBar/Search';
import { GetRandomColor } from 'components/Utils/CoolColors';
import React from 'react';
import { Link } from 'react-router-dom';

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
  smaller?: boolean;
}

function CustomChip({
  text,
  icon,
  onClick,
  onDelete,
  color,
  bgColor,
  linkTo,
  link = true,
  active = false,
  smaller = false,
}: Props) {
  // eslint-disable-next-line no-param-reassign
  bgColor = bgColor ?? GetRandomColor();
  // eslint-disable-next-line no-param-reassign
  color = color ?? bgColor;
  const ConditionalLink = link ? Link : Box;

  return (
    <ConditionalLink to={link ? linkTo ?? (text && searchTagsUrl([text])) ?? '' : ''}>
      <Chip
        key={text}
        label={text}
        icon={icon}
        variant="outlined"
        onClick={onClick}
        onDelete={onDelete}
        clickable
        size={smaller ? 'small' : 'medium'}
        sx={{
          color,
          borderColor: bgColor,
          '&:hover': {
            backgroundColor: `${bgColor}22`,
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
    </ConditionalLink>
  );
}

export default CustomChip;
