import { Chip } from '@mui/material';
import React from 'react';

export interface CustomChipInterface {
  text: string;
  onClick?: React.MouseEventHandler;
  color: string;
  active?: boolean;
}

const CustomChip = ({ text, onClick, color, active = false }: CustomChipInterface) => {
  return (
    <Chip
      key={text}
      label={text}
      variant="outlined"
      onClick={onClick} // () => setActiveChip(index)
      className={active ? 'chip--selected' : 'chip'}
      sx={{
        color,
        borderColor: color,
        '&.chip--selected': {
          color: '#FFF',
          backgroundColor: color,
        },
        '&.chip--selected:hover': {
          backgroundColor: color,
        },
      }}
    />
  );
};

export default CustomChip;
