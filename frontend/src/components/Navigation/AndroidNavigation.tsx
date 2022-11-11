import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import type { NavigationItem } from './Navigation';
import CustomNavLink from './CustomNavLink';

interface Props {
  items: NavigationItem[];
}

function AndroidNavigation({ items }: Props) {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }} elevation={3}>
      <BottomNavigation sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} showLabels>
        {items.map((item) => {
          return (
            <BottomNavigationAction
              component={CustomNavLink}
              to={item.route}
              key={item.order}
              label={item.title}
              icon={item.icon}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
export default AndroidNavigation;
