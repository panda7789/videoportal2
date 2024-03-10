import {
  AppBar,
  Box,
  Dialog,
  IconButton,
  List,
  Slide,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
// eslint-disable-next-line import/no-cycle
import theme from 'Theme';
import PasswordResetSubmitForm from 'components/Forms/PasswordResetSubmitForm';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

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

export const loader = ({ params }: { params: any }) => {
  return params.Token;
};

export function PasswordReset() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

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
      <Dialog
        fullScreen={!isDesktop}
        fullWidth={isDesktop}
        maxWidth={isDesktop ? 'xs' : false}
        open
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate('/')}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>{' '}
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Reset hesla
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {token ? (
            // eslint-disable-next-line no-nested-ternary
            <PasswordResetSubmitForm token={token} />
          ) : (
            <Typography>Neplatný token</Typography>
          )}
        </List>
      </Dialog>
    </Box>
  );
}
