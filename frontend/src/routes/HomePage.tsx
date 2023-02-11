import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import ChipLine from 'components/Chip/ChipLine';
import VideoCard from 'components/Thumbnail/VideoCard';
import { getVideoThumbnailById, VideoThumbnail } from 'model/Video';

function HomePage() {
  const [videos, setVideos] = useState<VideoThumbnail[]>([]);
  // const [filteredSubject, setFilteredSubject] = useState<string | null>(null);

  const loadVideoThumbnails = async () => {
    const x: VideoThumbnail[] = [];
    for (let i = 0; i < 15; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const video = await getVideoThumbnailById('asdf');
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
      <ChipLine
        chipData={['tag1', 'tag2', 'tag3'].map((x) => ({ color: '123', text: x }))}
        setActiveChipCallback={() => {}}
      />
      <Grid container spacing={1}>
        {filteredVideos.map((video) => {
          return (
            <Grid item xs={12} md={3} key={video.id}>
              <VideoCard key={video.id} video={{ ...video }} showDescription={false} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
export default HomePage;
