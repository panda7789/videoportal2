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
import { Channel, loader as channelLoader } from 'routes/Channel/Channel';
import { ChannelHomePage, loader as channelHomePageLoader } from 'routes/Channel/ChannelHomePage';
import { ChannelVideos, loader as channelVideosLoader } from 'routes/Channel/ChannelVideos';
import {
  ChannelPlaylists,
  loader as channelPlaylistsLoader,
} from 'routes/Channel/ChannelPlaylists';
import { ChannelInfo, loader as channelInfoLoader } from 'routes/Channel/ChannelInfo';
import { MyChannels } from 'routes/MyChannels';
import { ChannelEdit, loader as channelEditLoader } from 'routes/ChannelEdit';
import { UsersEdit } from 'routes/Users/UsersEdit';
import { UserEditor, loader as userEditLoader } from 'routes/Users/UserEdit';
import SearchResult from 'routes/SearchResult';
import { TagEdit } from 'routes/TagEdit';
import { MyPlaylists } from 'routes/MyPlaylists';
import { Route } from 'routes/RouteNames';

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
              path: `${Route.channel}/:channelId`,
              element: <Channel />,
              loader: channelLoader,
              children: [
                {
                  path: '',
                  element: <ChannelHomePage />,
                  loader: channelHomePageLoader,
                },
                {
                  path: 'videos',
                  element: <ChannelVideos />,
                  loader: channelVideosLoader,
                },
                {
                  path: 'playlists',
                  element: <ChannelPlaylists />,
                  loader: channelPlaylistsLoader,
                },
                {
                  path: 'info',
                  element: <ChannelInfo />,
                  loader: channelInfoLoader,
                },
              ],
            },
            {
              path: Route.myChannels,
              children: [
                {
                  path: '',
                  element: <MyChannels />,
                },
                {
                  path: 'create',
                  element: <ChannelEdit newChannel />,
                },
                {
                  path: ':Id',
                  element: <ChannelEdit />,
                  loader: channelEditLoader,
                },
              ],
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
