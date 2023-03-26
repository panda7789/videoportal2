import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  AppBar,
  Box,
  Dialog,
  Divider,
  IconButton,
  List,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MUIAvatar from '@mui/material/Avatar';
import { TransitionProps } from '@mui/material/transitions';
import React, { useContext } from 'react';
// eslint-disable-next-line import/no-cycle
import { UserContext } from 'routes/Root';
import theme from 'Theme';
import { SimpleListItem } from 'components/DropDownMenu/ListItem';
import LoginForm from 'components/Forms/LoginForm';
import RegistrationForm from 'components/Forms/RegistationForm';

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

function Avatar() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const userContext = useContext(UserContext);
  const [openRegistration, setOpenRegistration] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    userContext?.setUser(undefined);
    localStorage.removeItem('token');
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
        {userContext?.user?.initials}
      </MUIAvatar>
      <Dialog
        fullScreen={!isDesktop}
        fullWidth={isDesktop}
        maxWidth={isDesktop ? 'xs' : false}
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
          <MUIAvatar sx={{ height: '64px', width: '64px', m: 2 }}>
            {userContext?.user?.initials}
          </MUIAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" component="div">
              {userContext?.user?.name ?? 'Nepřihlášený uživatel'}
            </Typography>
            {userContext?.user && (
              <Typography variant="body1" component="div">
                Spravovat účet
              </Typography>
            )}
          </Box>
        </Box>
        <Divider variant="middle" />
        <List>
          {
            // eslint-disable-next-line no-nested-ternary
            userContext?.user ? (
              <>
                <SimpleListItem text="Nastavení" icon={<SettingsIcon />} />
                <SimpleListItem text="Odhlásit se" icon={<LogoutIcon />} onClick={handleLogout} />
              </>
            ) : openRegistration ? (
              <RegistrationForm handleLoginClick={() => setOpenRegistration(false)} />
            ) : (
              <LoginForm handleRegisterClick={() => setOpenRegistration(true)} />
            )
          }
        </List>
      </Dialog>
    </Box>
  );
}

export default Avatar;
