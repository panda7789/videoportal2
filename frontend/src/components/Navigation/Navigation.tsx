import { useMediaQuery } from '@mui/material';
import React from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import UpdateIcon from '@mui/icons-material/Update';
import theme from 'Theme';
import HistoryIcon from '@mui/icons-material/History';
import AndroidNavigation from './AndroidNavigation';
import DesktopNavigation from './DesktopNavigation';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

export interface NavigationItem {
  route: string;
  title: string;
  icon: JSX.Element;
}

export const NavigationItems: NavigationItem[] = [
  { route: '/', title: 'Nejnovější', icon: <UpdateIcon /> },
  { route: '/myportal', title: 'Můj portál', icon: <AccountBoxIcon /> },
  { route: '/myportal/history', title: 'Historie', icon: <HistoryIcon /> },
  { route: '/playlist/playLater', title: 'Přehrát později', icon: <WatchLaterIcon /> },
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
