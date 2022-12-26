import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import React from 'react';
import CustomNavLink from './CustomNavLink';
import type { NavigationItem } from './Navigation';

interface Props {
  items: NavigationItem[];
}

function DesktopNavigation({ items }: Props) {
  const drawerWidth = 256;
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        flexShrink: 0,
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {items.map((item) => (
          <ListItemButton component={CustomNavLink} to={item.route} key={item.route}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
export default DesktopNavigation;
