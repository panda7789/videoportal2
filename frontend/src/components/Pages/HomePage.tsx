import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChipLine from '../Chip/ChipLine';
import VideoCard from '../VideoCard/VideoCard';

const HomePage = () => {
  const [images, setImages] = useState<[]>([]);

  fetch('https://picsum.photos/list')
    .then((response) => response.json())
    .then((data) => {
      setImages(data.slice(0, 15));
    });
  return (
    <Box>
      <ChipLine />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {images.map((image) => {
          return (
            <VideoCard
              key={image}
              subject="YPS2"
              // eslint-disable-next-line @typescript-eslint/dot-notation
              imageSrc={`https://picsum.photos/376/280?image=${image['id']}`}
              title="Implementace GUI ve Visual Studio (Janoštík)"
            />
          );
        })}
      </Box>
    </Box>
  );
};
export default HomePage;
