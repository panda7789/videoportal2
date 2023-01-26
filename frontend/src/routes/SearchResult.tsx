import React from 'react';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import VideoCard from 'components/VideoThumbnail/VideoCard';
import { VideoThumbnail } from 'model/Video';
import { useLoaderData } from 'react-router-dom';

function SearchResult() {
  // loader
  // use loader
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

  // foreach search result
  // videoCard below each other
}
export default SearchResult;
