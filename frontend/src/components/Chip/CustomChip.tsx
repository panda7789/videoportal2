import { Chip } from '@mui/material';
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
}

function CustomChip({ text, icon, onClick, onDelete, color, bgColor, active = false }: Props) {
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
