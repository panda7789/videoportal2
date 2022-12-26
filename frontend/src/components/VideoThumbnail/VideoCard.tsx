import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import CustomChip from 'components/Chip/CustomChip';
import { VideoThumbnail } from 'model/Video';
import DropDownMenu, { DropDownMenuAction } from 'components/DropDownMenu/DropDownMenu';

function VideoCard(video: VideoThumbnail) {
  const { imageUrl, name, id } = video;

  const dropdownActions: DropDownMenuAction[] = [
    {
      name:"Ahoj",
      onClick: () => console.log("lolíček")
    }
  ];

  return (
    <Grid item xs={12} md={3}>
      <Card variant="outlined">
        <CardActionArea component={Link} to={`/video/${id}`}>
          <CardMedia
            component="img"
            draggable={false}
            sx={{ aspectRatio: '16/9' }}
            image={imageUrl}
            alt={imageUrl}
          />
          <CardContent
            sx={{ display: 'flex', alignItems: 'center', height: 64, padding: '0 8px 0 8px' }}
          >
            <CustomChip text="tag1" color="#123" active />
            <Typography
              variant="subtitle2"
              component="div"
              width="100%"
              height={48}
              textOverflow="ellipsis"
              overflow="hidden"
              display="-webkit-box"
              ml={1}
              sx={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
            >
              {name}
            </Typography>
            <DropDownMenu actions={dropdownActions}/>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default VideoCard;
