import { Grid } from '@mui/material';
import React from 'react';
import { Box } from '@mui/system';
import VideoCard from 'components/VideoThumbnail/VideoCard';
import { VideoThumbnail } from 'model/Video';
import { useLoaderData } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export function History() {
  const arr = useLoaderData() as VideoThumbnail[];

  return (
    <Box marginTop={4} marginBottom={4}>
      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
        {arr.map((video) => {
          return (
            <Grid key={video.id} item xs={8}>
              <VideoCard key={video.id} video={{ ...video }} large />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export async function loader() {
  const data: VideoThumbnail = {
    id: uuidv4(),
    name: `Implementace GUI ve Visual Studio (Janoštík)`,
    imageUrl: 'https://picsum.photos/1920/1080?grayscale',
    duration: '1:05',
    description:
      'Culpa commodo incididunt in sint amet quis deserunt excepteur nisi ex ad veniam nisi anim. Reprehenderit ipsum eiusmod aute sint ipsum deserunt officia id fugiat nostrud.',
  };
  const arr: VideoThumbnail[] = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    arr.push(data);
  }

  return arr;
}
