import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import React from 'react';
import CustomChip from '../Chip/CustomChip';

interface VideoCardInterface {
  title: string;
  imageSrc: string;
  subject: string;
}

const VideoCard = ({ title, imageSrc, subject }: VideoCardInterface) => {
  return (
    <Card sx={{ width: 376, height: 280 }}>
      <CardActionArea>
        <CardMedia component="img" height="212" image={imageSrc} alt={imageSrc} />
        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomChip text={subject} color="primary" />
          <Typography variant="body1" component="div">
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default VideoCard;
