import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import Theme from 'Theme';
import Root from 'routes/Root';
import ErrorPage from 'routes/ErrorPage';
import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/system';
import HomePage from 'routes/HomePage';
import VideoDetail, { loader as videoLoader } from 'routes/VideoDetail';
import SearchResult from 'routes/SearchResult';
import { loader as searchLoader } from 'components/AppBar/Search';
import { loader as historyLoader, History } from 'routes/MyPortal/History';
import MyPortal from 'routes/MyPortal/MyPortal';
import { MyVideos, loader as myVideosLoader } from 'routes/MyPortal/Videos';
import { VideoEdit, loader as videoEditLoader } from 'routes/VideoEdit';
import { Playlist, loader as playlistLoader } from 'routes/Playlist';
import {
  Channel,
  ChannelInfo,
  ChannelPlaylists,
  ChannelVideos,
  loader as channelLoader,
} from 'routes/Channel/Channel';
import { ChannelHomePage, loader as channelHomePageLoader } from 'routes/Channel/ChannelHomePage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'myportal',
          element: <MyPortal />,
          children: [
            {
              path: '',
              element: <MyVideos />,
              loader: myVideosLoader,
            },
            {
              path: 'history',
              element: <History />,
              loader: historyLoader,
            },
          ],
        },
        {
          path: 'channel/:channelId',
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
              // loader: historyLoader,
            },
            {
              path: 'playlists',
              element: <ChannelPlaylists />,
              // loader: historyLoader,
            },
            {
              path: 'info',
              element: <ChannelInfo />,
              // loader: historyLoader,
            },
          ],
        },
        {
          path: 'video/:videoId',
          element: <VideoDetail />,
          loader: videoLoader,
        },
        {
          path: 'videoedit/:videoId',
          element: <VideoEdit />,
          loader: videoEditLoader,
        },
        {
          path: 'search',
          element: <SearchResult />,
          loader: searchLoader,
        },
        {
          path: 'playlist/:playlistId',
          element: <Playlist />,
          loader: playlistLoader,
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
