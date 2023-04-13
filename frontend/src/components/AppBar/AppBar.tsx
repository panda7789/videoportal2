import React from 'react';
import { AppBar, Slide, Toolbar, useMediaQuery, useScrollTrigger } from '@mui/material';
import theme from 'Theme';
import Logo from './Logo';
import Search from './Search';
import Avatar from '../Avatar/Avatar';

interface Props {
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children } = props;
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const trigger = useScrollTrigger();

  if (isDesktop) return children;
  return (
    <Slide appear={false} direction="down" in={!isDesktop && !trigger}>
      {children}
    </Slide>
  );
}

function AppBarModified() {
  return (
    <HideOnScroll>
      <AppBar
        sx={{
          backgroundColor: 'primary.main',
          zIndex: 1201,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: [1, 0],
          }}
        >
          <Logo />
          <Search />
          <Avatar />
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default AppBarModified;
