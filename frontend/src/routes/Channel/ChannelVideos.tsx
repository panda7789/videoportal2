import React from 'react';
import VideoCard from 'components/Thumbnail/VideoCard';
import { Grid } from '@mui/material';
import { search, Video } from 'model/Video';
import { useLoaderData } from 'react-router-dom';

export async function loader({ params }: { params: any }) {
  return search('asdf');
}

export function ChannelVideos() {
  const videos = useLoaderData() as Video[];

  return (
    <Grid container spacing={1}>
      {videos.map((video) => {
        return (
          <Grid item xs={12} md={3} key={video.id}>
            <VideoCard key={video.id} video={{ ...video }} showChannel={false} />
          </Grid>
        );
      })}
    </Grid>
  );
}
