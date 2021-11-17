import { useMediaQuery } from '@mui/material';
import React from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BookIcon from '@mui/icons-material/Book';
import UpdateIcon from '@mui/icons-material/Update';
import theme from '../../Theme';
import AndroidNavigation from './AndroidNavigation';
import DesktopNavigation from './DesktopNavigation';

export interface NavigationItem {
  title: string;
  icon: JSX.Element;
  order: number;
}

export const NavigationItems: NavigationItem[] = [
  { title: 'Nejnovější', icon: <UpdateIcon />, order: 0 },
  { title: 'Předměty', icon: <BookIcon />, order: 1 },
  { title: 'Můj portál', icon: <AccountBoxIcon />, order: 2 },
];

const Navigation = () => {
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return isDesktop ? (
    <DesktopNavigation items={NavigationItems} />
  ) : (
    <AndroidNavigation items={NavigationItems} />
  );
};
export default Navigation;
