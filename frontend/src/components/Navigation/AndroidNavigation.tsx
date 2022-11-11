import React, { useContext } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import NavigationContext from './NavigationContext';
import type { NavigationItem } from './Navigation';

interface Props {
  items: NavigationItem[];
}

function AndroidNavigation({ items }: Props) {
  const { actualPage, setActualPage } = useContext(NavigationContext);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }} elevation={3}>
      <BottomNavigation
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        showLabels
        value={actualPage}
        onChange={(event, newValue) => {
          setActualPage(newValue);
        }}
      >
        {items.map((item) => {
          return <BottomNavigationAction key={item.order} label={item.title} icon={item.icon} />;
        })}
      </BottomNavigation>
    </Paper>
  );
}
export default AndroidNavigation;
