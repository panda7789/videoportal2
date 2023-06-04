import { useMediaQuery } from '@mui/material';
import React, { useContext } from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import theme from 'Theme';
import HomeIcon from '@mui/icons-material/Home';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DatasetIcon from '@mui/icons-material/Dataset';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { UserContext } from 'routes/Root';
import { UserRoles } from 'api/axios-client';
import AndroidNavigation from './AndroidNavigation';
import DesktopNavigation from './DesktopNavigation';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export interface NavigationItem {
  route: string;
  title: string;
  icon: JSX.Element;
  signed?: boolean;
  userRole?: [keyof UserRoles];
}

export const NavigationItems: NavigationItem[] = [
  { route: '/', title: 'Domů', icon: <HomeIcon /> },
  {
    route: '/myvideos',
    title: 'Moje videa',
    icon: <AccountBoxIcon />, // todo gearbox
    signed: true,
  },
  {
    route: '/playlist/playLater',
    title: 'Přehrát později',
    icon: <WatchLaterIcon />,
    signed: true,
  },
  {
    route: '/upload',
    title: 'Nahrát video',
    icon: <CloudUploadIcon />,
    signed: true,
    userRole: ['videoEditor'],
  },
  {
    route: '/mychannels',
    title: 'Moje kanály',
    icon: <DatasetIcon />,
    signed: true,
    userRole: ['videoEditor'],
  },
  {
    route: '/users',
    title: 'Správa uživatelů',
    icon: <ManageAccountsIcon />,
    signed: true,
    userRole: ['administrator'],
  },
  {
    route: '/tagEdit',
    title: 'Správa tagů',
    icon: <LocalOfferIcon />,
    signed: true,
    userRole: ['administrator'],
  },
];

function Navigation() {
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const userContext = useContext(UserContext);

  const itemsWithRights = NavigationItems.filter(
    (x) =>
      !x.signed ||
      (x.signed &&
        userContext?.user &&
        (x.userRole === undefined ||
          (userContext?.user?.roles &&
            x.userRole.some((role) => userContext?.user?.roles[role] === true ?? false)))),
  );

  return isDesktop ? (
    <DesktopNavigation items={itemsWithRights} />
  ) : (
    <AndroidNavigation items={itemsWithRights} />
  );
}
export default Navigation;
