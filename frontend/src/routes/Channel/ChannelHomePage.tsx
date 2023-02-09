import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { VideoInlineList } from 'components/InlineList/VideoInlineList';
import { getVideoThumbnailById, search, VideoThumbnail } from 'model/Video';
import { useLoaderData } from 'react-router-dom';
import { PlaylistInlineList } from 'components/InlineList/PlaylistInlineList';
import { Playlist } from 'model/Playlist';
import { getChannelPlaylists } from 'model/Channel';
import VideoCard from 'components/Thumbnail/VideoCard';

export interface Props {
  channelId: string;
  latestVideos: VideoThumbnail[];
  pinnedVideo?: VideoThumbnail;
}

export async function loader({ params }: { params: any }): Promise<Props> {
  return {
    channelId: params.channelId,
    latestVideos: await search('123'),
    pinnedVideo: await getVideoThumbnailById('asdf'),
  };
}

export function ChannelHomePage() {
  const { channelId, latestVideos, pinnedVideo } = useLoaderData() as Props;
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    (async () => {
      setPlaylists(await getChannelPlaylists(channelId));
    })();
  }, []);

  return (
    <Grid container>
      {pinnedVideo && (
        <Grid item xs={12}>
          <VideoCard key={pinnedVideo.id} video={{ ...pinnedVideo }} fullWidth withPlayer />
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography variant="h6">Videa</Typography>
        <VideoInlineList videos={latestVideos} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Playlisty</Typography>
        <PlaylistInlineList playlists={playlists} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Kdovíco</Typography>
        <VideoInlineList videos={latestVideos} />
      </Grid>
    </Grid>
  );
}
