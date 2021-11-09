import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import {
  AppBar,
  Box,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MUIAvatar from '@mui/material/Avatar';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

type AvatarProps = {
  inicials: string;
};

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) => {
    return <Slide direction="down" ref={ref} {...props} />;
  },
);

const Avatar = ({ inicials }: AvatarProps) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        width: '48px',
        height: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 1,
      }}
    >
      <MUIAvatar sx={{ height: '32px', width: '32px' }} onClick={handleClickOpen}>
        {inicials}
      </MUIAvatar>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Účet
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <MUIAvatar sx={{ height: '64px', width: '64px', m: 2 }}>{inicials}</MUIAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" component="div">
              Lukáš Linhart
            </Typography>
            <Typography variant="body1" component="div">
              Spravovat účet
            </Typography>
          </Box>
        </Box>
        <Divider variant="middle" />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SwitchAccountIcon />
              </ListItemIcon>
              <ListItemText primary="Přepnout účet" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Nastavení" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Odhlásit se" />
            </ListItemButton>
          </ListItem>
        </List>
      </Dialog>
    </Box>
  );
};

export default Avatar;
