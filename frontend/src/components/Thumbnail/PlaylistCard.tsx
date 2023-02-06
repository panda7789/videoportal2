/* eslint-disable no-nested-ternary */
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import React from 'react';
import DropDownMenu, { DropDownMenuAction } from 'components/DropDownMenu/DropDownMenu';
import AspectRatio from 'components/Utils/AspectRatio';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { Playlist } from 'model/Playlist';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VideoCard from './VideoCard';

export interface Props {
  playlist: Playlist;
  fullWidth?: boolean;
  smallThumbnail?: boolean;
}

export function PlaylistCard({ playlist, fullWidth, smallThumbnail }: Props) {
  const { duration, id, name, thumbnailUrl, videos } = playlist;

  const dropdownActions: DropDownMenuAction[] = [
    {
      name: 'asdf',
      onClick: () => console.log('lolíček'),
    },
  ];

  return (
    <Grid container component={Link} to={`/playlist/${id}`} style={{ textDecoration: 'none' }}>
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
          sx={{
            position: 'relative',
            ...(fullWidth && { display: 'flex' }),
            '&:hover .overlay': { display: 'flex' },
          }}
        >
          <AspectRatio ratio={16 / 9}>
            <CardMedia component="img" draggable={false} image={thumbnailUrl} alt={thumbnailUrl} />
          </AspectRatio>
          <Box
            className="overlay"
            sx={{
              position: 'absolute',
              color: 'white',
              height: '100%',
              width: '100%',
              top: 0,
              left: 0,
              backgroundColor: '#333333ee',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <PlayArrowIcon fontSize="large" />
            <Typography variant="button">Přehrát vše</Typography>
          </Box>
          <Box
            sx={{
              height: '100%',
              width: '40%',
              position: 'absolute',
              right: 0,
              top: 0,
              backgroundColor: '#333333bb',
              color: 'white',
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Typography variant="body1">{playlist.videos.length}</Typography>
            <PlaylistPlayIcon />
          </Box>
        </Grid>
        <Grid item xs={fullWidth ? (smallThumbnail ? 9.5 : 8) : 12} display="flex">
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...(!fullWidth && {
                height: 64,
                padding: '0 8px 0 8px',
              }),
              ...(smallThumbnail && {
                maxHeight: '100%',
                padding: '4px',
                paddingBottom: '4px !important',
              }),
              width: '100%',
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
                  ml={1}
                  pr={5}
                  sx={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                  {name}
                </Typography>
                <DropDownMenu sx={{ position: 'absolute', right: 0 }} actions={dropdownActions} />
              </Box>
            </Box>
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
              <Typography paddingLeft={1} variant={smallThumbnail ? 'caption' : 'body1'}>
                Zobrazit celý playlist
              </Typography>
            </Box>
          </CardContent>
        </Grid>
      </Card>
    </Grid>
  );
}

export default VideoCard;
