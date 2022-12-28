import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React, { useContext } from 'react';
import theme from 'Theme';
// eslint-disable-next-line import/no-cycle
import { NavigationContext } from 'routes/Root';
import CustomNavLink from './CustomNavLink';
import type { NavigationItem } from './Navigation';

interface Props {
  items: NavigationItem[];
}

function DesktopNavigation({ items }: Props) {
  const context = useContext(NavigationContext);

  const handleOpenClose = () => {
    context?.setOpen(!context?.open);
  }
  const drawerWidth = 256;
  return (
    <Drawer
      variant="permanent"
      open={context?.open}
      anchor="left"
      sx={{
        flexShrink: 0,
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(!context?.open && {
          '& .MuiDrawer-paper': {
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: `calc(${theme.spacing(7)} + 1px)`,
          },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflowX: 'hidden',
          width: `calc(${theme.spacing(7)} + 1px)`,
        }),
      }}
    >
      <Toolbar />
      <div>
        <IconButton onClick={handleOpenClose} sx={{p:2}}>
            <MenuIcon />
          </IconButton>
        </div>
        <Divider />
      <List>
        {items.map((item) => (
          <ListItem key={item.route} disablePadding sx={{display: 'block'}}>
            <ListItemButton component={CustomNavLink} to={item.route} key={item.route} >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
          ))}
        </List>
      
    </Drawer>
  );
}
export default DesktopNavigation;


/*
<List>
        
      </List>
      */
