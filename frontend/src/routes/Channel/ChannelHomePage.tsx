import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { VideoInlineList } from 'components/InlineList/VideoInlineList';
import { getVideoThumbnailById, search, VideoThumbnail } from 'model/Video';
import { Link, useLoaderData } from 'react-router-dom';
import { PlaylistInlineList } from 'components/InlineList/PlaylistInlineList';
import { Playlist } from 'model/Playlist';
import { getChannelPlaylists } from 'model/Channel';
import VideoCard from 'components/Thumbnail/VideoCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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
    <Grid container spacing={2}>
      {pinnedVideo && (
        <Grid item xs={12} mt={2} mb={2}>
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
        <Typography variant="h6" display="inline-block" sx={{ verticalAlign: 'middle' }}>
          Rozložený playlist
        </Typography>
        <Button
          sx={{ marginLeft: 2, fontSize: 11, color: 'black', borderColor: 'black' }}
          startIcon={<PlayArrowIcon />}
          variant="outlined"
          component={Link}
          to={'/playlist/12345'}
        >
          Přehrát vše
        </Button>
        <Typography variant="body2" pt={1}>
          Labore consequat occaecat duis ut dolore sint anim culpa sit.
        </Typography>
        <VideoInlineList videos={latestVideos} />
      </Grid>
    </Grid>
  );
}
