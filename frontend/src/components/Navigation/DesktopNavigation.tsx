import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import React, { useContext } from 'react';
import type { NavigationItem } from './Navigation';
import NavigationContext from './NavigationContext';

interface Props {
  items: NavigationItem[];
}

const DesktopNavigation = ({ items }: Props) => {
  const { actualPage, setActualPage } = useContext(NavigationContext);

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
        {items.map((item) => {
          return (
            <ListItemButton
              key={item.order}
              selected={actualPage === item.order}
              onClick={() => setActualPage(item.order)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};
export default DesktopNavigation;
