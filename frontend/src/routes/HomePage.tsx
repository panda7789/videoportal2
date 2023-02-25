import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import VideoCard from 'components/Thumbnail/VideoCard';
import { getVideoById, Video } from 'model/Video';

function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);

  const loadVideoThumbnails = async () => {
    const x: Video[] = [];
    for (let i = 0; i < 15; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const video = await getVideoById('asdf');
      x.push(video);
    }
    setVideos(x);
  };

  useEffect(() => {
    loadVideoThumbnails();
  }, []);

  const filteredVideos = videos.filter(
    () => true, // video.tags.contains.name === filteredSubject || filteredSubject === null,
  );

  return (
    <Box>
      <Grid container spacing={1} p={2}>
        {filteredVideos.map((video) => {
          return (
            <Grid item xs={12} md={3} key={video.id}>
              <VideoCard key={video.id} video={{ ...video }} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
export default HomePage;
