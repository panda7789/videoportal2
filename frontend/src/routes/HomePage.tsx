import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import ChipLine from 'components/Chip/ChipLine';
import VideoCard from 'components/VideoThumbnail/VideoCard';
import { VideoThumbnail } from 'model/Video';

function HomePage() {
  const [images, setImages] = useState<[]>([]);
  const [videos, setVideos] = useState<VideoThumbnail[]>([]);
  // const [filteredSubject, setFilteredSubject] = useState<string | null>(null);

  const videoNames: string[] = [
    'Excepteur Lorem proident in magna ad velit duis quis fugiat eiusmod laboris ipsum enim id',
    'Consectetur enim voluptate esse non velit tempor adipisicing adipisicing cillum',
    'Amet et minim nostrud sunt',
    'Sit aliquip officia aliquip et fugiat anim aliquip Lorem incididunt nostrud laborum sit',
  ];
  const loadVideoThumbnails = () => {
    const x: VideoThumbnail[] = [];
    for (let i = 0; i < 15; i += 1) {
      const video: VideoThumbnail = {
        id: i.toString(),
        name: videoNames[Math.floor(Math.random() * videoNames.length)],
        imageUrl: `https://picsum.photos/id/${
          // eslint-disable-next-line @typescript-eslint/dot-notation
          images[Math.floor(Math.random() * images.length)]['id']
        }/500/280`,
      };
      x.push(video);
    }
    setVideos(x);
  };

  useEffect(() => {
    fetch('https://picsum.photos/v2/list')
      .then((response) => response.json())
      .then((data) => {
        setImages(data.slice(0, 15));
      });
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      loadVideoThumbnails();
    }
  }, [images]);

  const filteredVideos = videos.filter(
    () => true // video.tags.contains.name === filteredSubject || filteredSubject === null,
  );

  return (
    <Box>
      <ChipLine
        chipData={["tag1", "tag2", "tag3"].map(x => ({color: "123", text: x}))}
        setActiveChipCallback={() => { }}
      />
      <Grid container spacing={1}>
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            imageSrc={video.imageUrl}
            title={video.name}
          />
        ))}
      </Grid>
    </Box>
  );
}
export default HomePage;
