import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Theme from 'Theme';
import Root from 'routes/Root';
import ErrorPage from 'routes/ErrorPage';
import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/system';
import HomePage from 'routes/HomePage';
import VideoDetail, { loader as videoLoader } from 'routes/VideoDetail';
import { loader as searchLoader } from 'components/AppBar/Search';
import { MyVideos } from 'routes/MyVideos';
import { VideoEdit, loader as videoEditLoader } from 'routes/VideoEdit';
import { PlaylistDetail, loader as playlistLoader } from 'routes/Playlist';
import { Channel, loader as channelLoader } from 'routes/_Channel/Channel';
import { ChannelHomePage, loader as channelHomePageLoader } from 'routes/_Channel/ChannelHomePage';
import { ChannelVideos, loader as channelVideosLoader } from 'routes/_Channel/ChannelVideos';
import {
  ChannelPlaylists,
  loader as channelPlaylistsLoader,
} from 'routes/_Channel/ChannelPlaylists';
import { ChannelInfo, loader as channelInfoLoader } from 'routes/_Channel/ChannelInfo';
import { MyChannels } from 'routes/_MyChannels';
import { ChannelEdit, loader as channelEditLoader } from 'routes/_ChannelEdit';
import { UsersEdit } from 'routes/Users/UsersEdit';
import { UserEditor, loader as userEditLoader } from 'routes/Users/UserEdit';
import SearchResult from 'routes/SearchResult';
import { TagEdit } from 'routes/TagEdit';
import { MyPlaylists } from 'routes/MyPlaylists';
import { Route } from 'routes/RouteNames';
import { UserGroup } from 'api/axios-client';
import { UserGroups } from 'routes/Users/UserGroups';
import { UserGroupEdit, loader as groupsLoader } from 'routes/Users/UserGroupEdit';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          errorElement: <ErrorPage />,

          children: [
            {
              index: true,
              element: <HomePage />,
            },
            {
              path: Route.myVideos,
              element: <MyVideos />,
            },
            {
              path: `${Route.video}/:videoId`,
              element: <VideoDetail />,
              loader: videoLoader,
            },
            {
              path: `${Route.videoEdit}/:videoId`,
              element: <VideoEdit />,
              loader: videoEditLoader,
            },
            {
              path: Route.upload,
              element: <VideoEdit newVideo />,
            },
            {
              path: Route.search,
              element: <SearchResult />,
              loader: searchLoader,
            },
            {
              path: `${Route.playlist}/:Id`,
              element: <PlaylistDetail />,
              loader: playlistLoader,
            },
            {
              path: Route.users,
              element: <UsersEdit />,
            },
            {
              path: `${Route.userEdit}/:Id`,
              element: <UserEditor />,
              loader: userEditLoader,
            },
            {
              path: Route.userEdit,
              element: <UserEditor newUser />,
            },
            {
              path: Route.tagEdit,
              element: <TagEdit />,
            },
            {
              path: Route.myPlaylists,
              children: [
                {
                  path: '',
                  element: <MyPlaylists />,
                },
                {
                  path: 'create',
                  element: <PlaylistDetail newPlaylist />,
                },
                {
                  path: ':Id',
                  element: <PlaylistDetail />,
                  loader: playlistLoader,
                },
              ],
            },
            {
              path: Route.groups,
              children: [
                {
                  path: '',
                  element: <UserGroups />,
                },
                {
                  path: 'create',
                  element: <UserGroupEdit newGroup />,
                },
                {
                  path: ':Id',
                  element: <UserGroupEdit />,
                  loader: groupsLoader,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ThemeProvider theme={Theme}>
      <Box sx={{ display: 'flex' }}>
        <RouterProvider router={router} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
