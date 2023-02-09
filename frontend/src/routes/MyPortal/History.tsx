import { Grid } from '@mui/material';
import React from 'react';
import { Box } from '@mui/system';
import VideoCard from 'components/Thumbnail/VideoCard';
import { getVideoThumbnailById, VideoThumbnail } from 'model/Video';
import { useLoaderData } from 'react-router-dom';

export function History() {
  const arr = useLoaderData() as VideoThumbnail[];

  return (
    <Box marginTop={4} marginBottom={4}>
      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
        {arr.map((video) => {
          return (
            <Grid key={video.id} item xs={8}>
              <VideoCard key={video.id} video={{ ...video }} fullWidth />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export async function loader() {
  const video = await getVideoThumbnailById('asdf');
  const arr: VideoThumbnail[] = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    arr.push(video);
  }

  return arr;
}
