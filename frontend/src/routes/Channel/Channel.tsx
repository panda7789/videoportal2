import React, { useEffect, useState } from 'react';
import { Avatar, Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {
  Channel as ChannelModel,
  ChannelUserSpecificInfo,
  getChannelById,
  getChannelUserSpecificInfo,
} from 'model/Channel';

import { Link, Outlet, useLoaderData } from 'react-router-dom';
import { NumberToWords } from 'components/Utils/NumberUtils';
import HomeIcon from '@mui/icons-material/Home';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import InfoIcon from '@mui/icons-material/Info';

export async function loader({ params }: { params: any }) {
  return getChannelById(params);
}

export function Channel() {
  const channelBasicInfo = useLoaderData() as ChannelModel;

  const [channelUserSpecificInfo, setChannelUserSpecificInfo] = useState<ChannelUserSpecificInfo>();
  useEffect(() => {
    (async () => {
      setChannelUserSpecificInfo(await getChannelUserSpecificInfo(channelBasicInfo.id));
    })();
  }, []);
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  return (
    <Box>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <img width="100%" src={channelBasicInfo.posterUrl} alt="channel poster" />
        </Grid>
        <Grid item xs={10} display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                width: 64,
                height: 64,
                border: '0.1px solid lightgray',
                padding: '4px',
                img: { objectFit: 'fill', borderRadius: '50%' },
              }}
              src="/upol.png"
            />
            <Box display="flex" flexDirection="column" pl={2}>
              <Typography variant="h5">{channelBasicInfo.name}</Typography>
              <Typography variant="caption">
                {NumberToWords(channelBasicInfo.subscribersCount)} odběratelů
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            {channelUserSpecificInfo?.subscribed ?? false ? (
              <Button variant="outlined">Zrušit odběr</Button>
            ) : (
              <Button variant="contained">Odebírat</Button>
            )}
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Tabs
            value={tab}
            sx={{ height: '48px', minHeight: '48px' }}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab
              icon={<HomeIcon />}
              iconPosition="start"
              component={Link}
              sx={{ height: '48px', minHeight: '48px' }}
              to="./"
              label="Domovská stránka"
            />
            <Tab
              icon={<OndemandVideoIcon />}
              iconPosition="start"
              component={Link}
              sx={{ height: '48px', minHeight: '48px' }}
              to="./videos"
              label="Videa"
            />
            <Tab
              icon={<VideoLibraryIcon />}
              iconPosition="start"
              component={Link}
              sx={{ height: '48px', minHeight: '48px' }}
              to="./playlists"
              label="Playlisty"
            />
            <Tab
              icon={<InfoIcon />}
              iconPosition="start"
              component={Link}
              sx={{ height: '48px', minHeight: '48px' }}
              to="./info"
              label="Informace"
            />
          </Tabs>
        </Grid>
        <Grid item xs={10} margin={2}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
}


export function ChannelVideos() {
  return <Typography>Videos</Typography>;
}
export function ChannelPlaylists() {
  return <Typography>Playlists</Typography>;
}
export function ChannelInfo() {
  return <Typography>Info</Typography>;
}
