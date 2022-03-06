import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import ChipLine from '../Chip/ChipLine';
import VideoCard from '../VideoCard/VideoCard';
import { Faculty, GetColorByFaculty } from '../../Theme';
import { Subject } from '../../model/Subject';
import { VideoThumbnail } from '../../model/VideoThumbnail';
import { CustomChipInterface } from '../Chip/CustomChip';

const HomePage = () => {
  const [images, setImages] = useState<[]>([]);
  const [videos, setVideos] = useState<VideoThumbnail[]>([]);
  const [filteredSubject, setFilteredSubject] = useState(null);

  const subjects: Subject[] = [
    { name: 'YAML2', teacher: 'Pan Dan', faculty: Faculty.Cyrilometodejska },
    { name: 'YALM1', teacher: 'Pan Daň', faculty: Faculty.Prirodovedecka },
    { name: 'MAT', teacher: 'Pan Ván', faculty: Faculty.Pedagogicka },
  ];
  const videoNames: string[] = [
    'Excepteur Lorem proident in magna ad velit duis quis fugiat eiusmod laboris ipsum enim id',
    'Consectetur enim voluptate esse non velit tempor adipisicing adipisicing cillum',
    'Amet et minim nostrud sunt',
    'Sit aliquip officia aliquip et fugiat anim aliquip Lorem incididunt nostrud laborum sit',
  ];

  useEffect(() => {
    for (let i = 0; i < 15; i += 1) {
      const video: VideoThumbnail = {
        name: videoNames[Math.floor(Math.random() * videoNames.length)],
        imageUrl: images[Math.floor(Math.random() * images.length)],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
      };
      videos.push(video);
    }
  }, []);

  useEffect(() => {
    fetch('https://picsum.photos/list')
      .then((response) => response.json())
      .then((data) => {
        setImages(data.slice(0, 15));
      });
  }, []);
  return (
    <Box>
      <ChipLine
        chipData={subjects.map<CustomChipInterface>((x) => ({
          text: x.name,
          color: GetColorByFaculty(x.faculty),
        }))}
      />
      <Grid container spacing={1}>
        {videos
          .filter((video) => video.subject.name === filteredSubject || filteredSubject === null)
          .map((video) => {
            return (
              <VideoCard
                key={video.name}
                subject={video.subject}
                imageSrc={video.imageUrl}
                title={video.name}
              />
            );
          })}
      </Grid>
    </Box>
  );
};
export default HomePage;
