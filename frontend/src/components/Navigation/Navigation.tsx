import { useMediaQuery } from '@mui/material';
import React from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import theme from 'Theme';
import HomeIcon from '@mui/icons-material/Home';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DatasetIcon from '@mui/icons-material/Dataset';
import AndroidNavigation from './AndroidNavigation';
import DesktopNavigation from './DesktopNavigation';

export interface NavigationItem {
  route: string;
  title: string;
  icon: JSX.Element;
}

export const NavigationItems: NavigationItem[] = [
  { route: '/', title: 'Domů', icon: <HomeIcon /> },
  { route: '/myportal', title: 'Můj portál', icon: <AccountBoxIcon /> },
  { route: '/playlist/playLater', title: 'Přehrát později', icon: <WatchLaterIcon /> },
  { route: '/upload', title: 'Nahrát video', icon: <CloudUploadIcon /> },
  { route: '/mychannels', title: 'Moje kanály', icon: <DatasetIcon /> },
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
