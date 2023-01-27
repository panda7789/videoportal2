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
          path: 'video/:videoId',
          element: <VideoDetail />,
          loader: videoLoader,
        },
        {
          path: 'search',
          element: <SearchResult />,
          loader: searchLoader,
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
