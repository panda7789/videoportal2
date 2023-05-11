import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { VideoInlineList } from 'components/InlineList/VideoInlineList';
import { useLoaderData } from 'react-router-dom';
import {
  ExpandedPlaylistInlineList,
  PlaylistInlineList,
} from 'components/InlineList/PlaylistInlineList';
import { PlaylistModel } from 'model/Playlist';
import { getChannelPlaylists } from 'model/Channel';
import VideoCard from 'components/Thumbnail/VideoCard';
import { useChannelVideosQuery, useVideosGETQuery } from 'api/axios-client/Query';

export interface Props {
  channelId: string;
  pinnedVideoId: string;
}

export async function loader({ params }: { params: any }): Promise<Props> {
  return {
    channelId: params.channelId,
    pinnedVideoId: params.channelPinnedVideoId,
  };
}

export function ChannelHomePage() {
  const { channelId, pinnedVideoId } = useLoaderData() as Props;
  const [playlists, setPlaylists] = useState<PlaylistModel[]>([]);
  const latestVideos = useChannelVideosQuery(channelId);
  const pinnedVideo = useVideosGETQuery(pinnedVideoId);

  useEffect(() => {
    (async () => {
      setPlaylists(await getChannelPlaylists(channelId));
    })();
  }, []);

  return (
    <Grid container spacing={2}>
      {pinnedVideo?.data && (
        <Grid item xs={12} mt={2} mb={2}>
          <VideoCard
            key={pinnedVideo.data.id}
            video={pinnedVideo.data}
            fullWidth
            withPlayer
            showChannel={false}
          />
        </Grid>
      )}
      {latestVideos?.data && (
        <Grid item xs={12}>
          <Typography variant="h6">Videa</Typography>
          <VideoInlineList videos={latestVideos?.data.items} showDescription />
        </Grid>
      )}
      {playlists.length > 0 && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6">Playlisty</Typography>
            <PlaylistInlineList playlists={playlists} />
          </Grid>
          <Grid item xs={12}>
            <ExpandedPlaylistInlineList playlist={playlists[0]} />
          </Grid>
        </>
      )}
    </Grid>
  );
}
