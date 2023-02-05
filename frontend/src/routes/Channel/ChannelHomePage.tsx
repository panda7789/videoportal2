import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { VideoInlineList } from "components/InlineList/VideoInlineList";
import { search, VideoThumbnail } from "model/Video";
import { useLoaderData } from "react-router-dom";
import { PlaylistInlineList } from "components/InlineList/PlaylistInlineList";
import { Playlist } from "model/Playlist";
import { getChannelPlaylists } from "model/Channel";

export interface Props {
  channelId: string;
  latestVideos: VideoThumbnail[];
}

export async function loader({ params }: { params: any }): Promise<Props> {
  return { channelId: params.channelId, latestVideos: await search('123') };
}


export function ChannelHomePage() {
  const {channelId, latestVideos} = useLoaderData() as Props;
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    (async () => {
      setPlaylists(await getChannelPlaylists(channelId))
    })();
  }, []);

  return (
    <Grid container>
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