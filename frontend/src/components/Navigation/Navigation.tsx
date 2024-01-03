import { useMediaQuery } from '@mui/material';
import React, { useContext } from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import theme from 'Theme';
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GroupIcon from '@mui/icons-material/Group';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { UserContext } from 'routes/Root';
import { UserRoles } from 'api/axios-client';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import AndroidNavigation from 'components/Navigation/AndroidNavigation';
import DesktopNavigation from 'components/Navigation/DesktopNavigation';
import { Route } from 'routes/RouteNames';

export interface NavigationItem {
  route: string;
  title: string;
  icon: JSX.Element;
  signed?: boolean;
  userRole?: (keyof UserRoles)[];
}

export const NavigationItems: NavigationItem[] = [
  { route: '/', title: 'Domů', icon: <HomeIcon /> },
  {
    route: `/${Route.upload}`,
    title: 'Nahrát video',
    icon: <CloudUploadIcon />,
    signed: true,
    userRole: ['videoEditor'],
  },
  {
    route: `/${Route.myVideos}`,
    title: 'Moje videa',
    icon: <AccountBoxIcon />, // todo gearbox
    signed: true,
    userRole: ['videoEditor'],
  },
  {
    route: `/${Route.myPlaylists}`,
    title: 'Správa playlistů',
    icon: <PlaylistPlayIcon />,
    signed: true,
    userRole: ['user', 'administrator'],
  },

  {
    route: `/${Route.users}`,
    title: 'Správa uživatelů',
    icon: <ManageAccountsIcon />,
    signed: true,
    userRole: ['administrator'],
  },
  {
    route: `/${Route.groups}`,
    title: 'Správa skupin',
    icon: <GroupIcon />,
    signed: true,
    userRole: ['videoEditor', 'administrator'],
  },
  {
    route: `/${Route.tagEdit}`,
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
