import { Card, CardMedia, CardContent, Typography, Grid, Avatar } from '@mui/material';
import React from 'react';
import { VideoThumbnail } from 'model/Video';
import DropDownMenu, { DropDownMenuAction } from 'components/DropDownMenu/DropDownMenu';
import AspectRatio from 'components/Utils/AspectRatio';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

interface Props {
  video: VideoThumbnail;
  large?: boolean;
}

function VideoCard({ video, large }: Props) {
  const { imageUrl, name, id, duration, description } = video;

  const dropdownActions: DropDownMenuAction[] = [
    {
      name: 'Přehrát později',
      onClick: () => console.log('lolíček'),
    },
  ];

  return (
    <Grid container component={Link} to={`/video/${id}`} style={{ textDecoration: 'none' }}>
      <Card
        variant="outlined"
        sx={{
          ...(large && {
            display: 'flex',
          }),
          width: '100%',
        }}
      >
        <Grid
          item
          xs={large ? 4 : 12}
          sx={{ position: 'relative', ...(large && { display: 'flex' }) }}
        >
          <AspectRatio ratio={16 / 9}>
            <CardMedia component="img" draggable={false} image={imageUrl} alt={imageUrl} />
          </AspectRatio>
          <Typography
            sx={{
              height: 16,
              color: 'white',
              position: 'absolute',
              right: 0,
              bottom: 0,
              padding: 1,
              backgroundColor: '#333333bb',
              borderRadius: '10%',
            }}
          >
            {duration}
          </Typography>
        </Grid>
        <Grid item xs={large ? 8 : 12} display="flex">
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...(!large && {
                height: 64,
                padding: '0 8px 0 8px',
              }),
              width: '100%',
            }}
          >
            <Box>
              <Box display="flex">
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
                <DropDownMenu actions={dropdownActions} />
              </Box>
              <Typography variant="body2">{description}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  border: '0.1px solid lightgray',
                  padding: '4px',
                  img: { objectFit: 'fill', borderRadius: '50%' },
                }}
                src="/upol.png"
              />
              <Typography paddingLeft={1}>Univerzita Palackého v Olomouci</Typography>
            </Box>
          </CardContent>
        </Grid>
      </Card>
    </Grid>
  );
}

export default VideoCard;
