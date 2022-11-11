import { useMediaQuery } from '@mui/material';
import React from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BookIcon from '@mui/icons-material/Book';
import UpdateIcon from '@mui/icons-material/Update';
import theme from 'Theme';
import AndroidNavigation from './AndroidNavigation';
import DesktopNavigation from './DesktopNavigation';

export interface NavigationItem {
  route: string;
  title: string;
  icon: JSX.Element;
  order: number;
}

export const NavigationItems: NavigationItem[] = [
  { route: '/', title: 'Nejnovější', icon: <UpdateIcon />, order: 0 },
  { route: '/subjects', title: 'Předměty', icon: <BookIcon />, order: 1 },
  { route: '/myportal', title: 'Můj portál', icon: <AccountBoxIcon />, order: 2 },
];

function Navigation() {
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return isDesktop ? (
    <DesktopNavigation items={NavigationItems} />
  ) : (
    <AndroidNavigation items={NavigationItems} />
  );
}
export default Navigation;
