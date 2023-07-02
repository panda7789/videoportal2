import React, { useContext, useEffect } from 'react';
import { Avatar, Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link, Outlet, useLoaderData } from 'react-router-dom';
import { NumberToWords } from 'components/Utils/NumberUtils';
import HomeIcon from '@mui/icons-material/Home';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import { ApiPath } from 'components/Utils/APIUtils';
import { Channel as ChannelModel, getChannelById } from 'model/Channel';
import { useChannelUserInfoGETQuery, useChannelUserInfoPUTMutation } from 'api/axios-client/Query';
import { UserContext } from 'routes/Root';
import { ChannelUserSpecificInfoDTO } from 'api/axios-client';
import { GetInitials } from 'components/Utils/StringUtils';

export async function loader({ params }: { params: any }) {
  return getChannelById(params.channelId);
}

export function Channel() {
  const channelBasicInfo = useLoaderData() as ChannelModel;

  const userContext = useContext(UserContext);
  const channelUserSpecificInfoQuery = useChannelUserInfoGETQuery(channelBasicInfo.id, {
    enabled: !!userContext?.user,
    staleTime: 1 * 60 * 1000,
  });
  const channelUserInfoPUTMutation = useChannelUserInfoPUTMutation(channelBasicInfo.id, {
    onSuccess: () => {
      channelUserSpecificInfoQuery.refetch();
    },
  });
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  const handleSubscribe = (_: any) => {
    channelUserInfoPUTMutation.mutate(new ChannelUserSpecificInfoDTO({ subscribed: true }));
  };

  const handleUnsubscribe = (_: any) => {
    channelUserInfoPUTMutation.mutate(new ChannelUserSpecificInfoDTO({ subscribed: false }));
  };

  useEffect(() => {
    channelUserSpecificInfoQuery.refetch();
  }, [userContext?.user]);

  return (
    <Box>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          {channelBasicInfo?.posterUrl ? (
            <img
              width="100%"
              height="200px"
              style={{ objectFit: 'cover' }}
              src={ApiPath(channelBasicInfo.posterUrl)}
              alt="channel poster"
            />
          ) : (
            <Box height="50px" />
          )}
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
              src={ApiPath(channelBasicInfo.avatarUrl)}
            >
              {!channelBasicInfo.avatarUrl ? GetInitials(channelBasicInfo.name) : ''}
            </Avatar>

            <Box display="flex" flexDirection="column" pl={2}>
              <Typography variant="h5">{channelBasicInfo.name}</Typography>
              <Typography variant="caption">
                {NumberToWords(channelBasicInfo.subscribersCount)} odběratelů
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            {channelUserSpecificInfoQuery?.data?.subscribed ?? false ? (
              <Button
                variant="outlined"
                onClick={handleUnsubscribe}
                disabled={channelUserInfoPUTMutation?.isLoading}
              >
                Zrušit odběr
              </Button>
            ) : (
              <Button
                variant="contained"
                disabled={!userContext?.user || channelUserInfoPUTMutation?.isLoading}
                onClick={handleSubscribe}
              >
                Odebírat
              </Button>
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
