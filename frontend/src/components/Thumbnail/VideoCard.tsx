/* eslint-disable no-nested-ternary */
import { Card, CardMedia, CardContent, Typography, Grid, Avatar } from '@mui/material';
import React from 'react';
import { Video } from 'model/Video';
import DropDownMenu, { DropDownMenuAction } from 'components/DropDownMenu/DropDownMenu';
import AspectRatio from 'components/Utils/AspectRatio';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { VideoPlayer } from 'components/VideoDetail/VideoPlayer';

interface Props {
  video: Video;
  fullWidth?: boolean;
  smallThumbnail?: boolean;
  showDescription?: boolean;
  showChannel?: boolean;
  showAvatar?: boolean;
  showStats?: boolean;
  withPlayer?: boolean;
}

function VideoCard({
  video,
  fullWidth,
  smallThumbnail,
  showDescription,
  showAvatar,
  showChannel,
  showStats,
  withPlayer,
}: Props) {
  const { imageUrl, name, id, duration, description } = video;

  const dropdownActions: DropDownMenuAction[] = [
    {
      name: 'Přehrát později',
      onClick: () => console.log('lolíček'),
    },
  ];

  return (
    <Grid container style={{ textDecoration: 'none' }}>
      <Card
        variant="outlined"
        sx={{
          ...(fullWidth && {
            display: 'flex',
          }),
          ...(!fullWidth && {
            height: '100%',
          }),
          width: '100%',
        }}
      >
        <Grid
          item
          xs={fullWidth ? (smallThumbnail ? 2.5 : 4) : 12}
          sx={{ position: 'relative', ...(fullWidth && { display: 'flex' }) }}
        >
          {withPlayer ? (
            <VideoPlayer videoSrc="/sampleVideo.mp4" autoplay muted />
          ) : (
            <Box component={Link} to={`/video/${id}`}>
              <AspectRatio ratio={16 / 9}>
                <CardMedia component="img" draggable={false} image={imageUrl} alt={imageUrl} />
              </AspectRatio>
              <Typography
                variant="caption"
                padding={0.5}
                sx={{
                  height: 16,
                  color: 'white',
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#333333bb',
                  borderRadius: '10%',
                }}
              >
                {duration}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={fullWidth ? (smallThumbnail ? 9.5 : 8) : 12}
          display="flex"
          component={Link}
          to={`/video/${id}`}
          style={{ textDecoration: 'none' }}
        >
          <CardContent
            sx={{
              display: 'grid',
              paddingBottom: '4px !important',
              width: '100%',
              padding: 1,
              paddingRight: 0,
              paddingTop: 0,
              ...(!fullWidth && {
                minHeight: 64,
              }),
              ...(fullWidth && {
                paddingRight: 1,
              }),
              ...(smallThumbnail && {
                maxHeight: '100%',
                paddingBottom: '4px !important',
              }),
            }}
          >
            <Box>
              <Box display="flex" position="relative">
                <Typography
                  variant="subtitle2"
                  component="div"
                  width="100%"
                  height={fullWidth ? 24 : 'auto'}
                  textOverflow="ellipsis"
                  overflow="hidden"
                  display="-webkit-box"
                  pb="4px"
                  pt={1}
                  sx={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                  {name}
                </Typography>
                <DropDownMenu actions={dropdownActions} />
              </Box>
              {(showDescription ?? false) && (
                <Typography
                  variant="caption"
                  sx={{
                    display: '-webkit-box',
                    '-webkit-line-clamp': '2',
                    '-webkit-box-orient': 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {description}
                </Typography>
              )}
              {(showStats ?? true) && (
                <Box pb="4px">
                  <Typography variant="caption">{video.views} zhlédnutí • </Typography>
                  <Typography variant="caption">{video.uploadTimestamp}</Typography>
                </Box>
              )}
            </Box>
            {(showChannel ?? true) && (
              <Box
                display="flex"
                alignItems="center"
                component={Link}
                to="/channel/12345"
                sx={{
                  textDecoration: 'none',
                  color: 'unset',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  borderRadius: '15px',
                }}
              >
                {(showAvatar ?? true) && (
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
                )}

                <Typography paddingLeft={1} variant={smallThumbnail ? 'caption' : 'body1'}>
                  Univerzita Palackého v Olomouci
                </Typography>
              </Box>
            )}
          </CardContent>
        </Grid>
      </Card>
    </Grid>
  );
}

export default VideoCard;
