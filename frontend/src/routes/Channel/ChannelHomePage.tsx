import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { VideoInlineList } from 'components/InlineList/VideoInlineList';
import { getVideoById, search, Video } from 'model/Video';
import { useLoaderData } from 'react-router-dom';
import {
  ExpandedPlaylistInlineList,
  PlaylistInlineList,
} from 'components/InlineList/PlaylistInlineList';
import { PlaylistModel } from 'model/Playlist';
import { getChannelPlaylists } from 'model/Channel';
import VideoCard from 'components/Thumbnail/VideoCard';

export interface Props {
  channelId: string;
  latestVideos: Video[];
  pinnedVideo?: Video;
}

export async function loader({ params }: { params: any }): Promise<Props> {
  return {
    channelId: params.channelId,
    latestVideos: await search('123'),
    pinnedVideo: await getVideoById('asdf'),
  };
}

export function ChannelHomePage() {
  const { channelId, latestVideos, pinnedVideo } = useLoaderData() as Props;
  const [playlists, setPlaylists] = useState<PlaylistModel[]>([]);

  useEffect(() => {
    (async () => {
      setPlaylists(await getChannelPlaylists(channelId));
    })();
  }, []);

  return (
    <Grid container spacing={2}>
      {pinnedVideo && (
        <Grid item xs={12} mt={2} mb={2}>
          <VideoCard
            key={pinnedVideo.id}
            video={{ ...pinnedVideo }}
            fullWidth
            withPlayer
            showChannel={false}
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="h6">Videa</Typography>
        <VideoInlineList videos={latestVideos} />
      </Grid>
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
