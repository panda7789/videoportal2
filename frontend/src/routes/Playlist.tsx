import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Grid, IconButton, List, Typography } from '@mui/material';
import { Box } from '@mui/system';
import VideoCard from 'components/Thumbnail/VideoCard';
import { useLoaderData } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';

import { getPlaylistById, PlaylistModel as playlistModel } from 'model/Playlist';
import AspectRatio from 'components/Utils/AspectRatio';
import ScrollToTop from 'components/Utils/ScrollOnTop';
import { VerticalList } from 'components/VerticalList/VerticalList';
import { Video } from 'model/Video';

export async function loader({ params }: { params: any }) {
  return getPlaylistById(params);
}

export interface Props {
  playlist?: playlistModel;
}

export function PlaylistDetail({ playlist: playlistProp }: Props) {
  const playlistFromLoader = useLoaderData() as playlistModel;
  const [playlist, setPlaylist] = useState<playlistModel>(playlistProp ?? playlistFromLoader);

  useLayoutEffect(() => ScrollToTop(), [playlist.id]);

  const onListDragEnd = (videos: Video[]) => {
    setPlaylist({ ...playlist, videos });
  };

  return (
    <Box margin={4}>
      <Grid container xs={12} sx={{ alignItems: 'flex-start' }}>
        <Grid
          item
          padding={2}
          position={{ xs: 'initial', md: 'fixed' }}
          width={{ xs: '100%', md: 'calc(100%/4.4)' }}
        >
          <AspectRatio ratio={16 / 9}>
            <img width="100%" src={playlist.thumbnailUrl} />
          </AspectRatio>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5" padding={1}>
              {playlist.name}
            </Typography>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Box>
          <Typography variant="body1" padding={1}>
            Celková délka: {playlist.duration}
          </Typography>
          <Box display="flex">
            <Button startIcon={<PlayArrowIcon />} variant="contained">
              Přehrát celý playlist
            </Button>
          </Box>
        </Grid>
        <VerticalList videos={playlist.videos} onDragEnd={onListDragEnd} />
      </Grid>
    </Box>
  );
}
