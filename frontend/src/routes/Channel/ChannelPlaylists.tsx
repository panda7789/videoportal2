import React from 'react';
import { Grid } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { PlaylistModel } from 'model/Playlist';
import { PlaylistCard } from 'components/Thumbnail/PlaylistCard';
import { getChannelPlaylists } from 'model/Channel';

export async function loader({ params }: { params: any }) {
  return getChannelPlaylists('asdf');
}

export function ChannelPlaylists() {
  const playlists = useLoaderData() as PlaylistModel[];

  return (
    <Grid container spacing={1}>
      {playlists.map((playlist) => {
        return (
          <Grid item xs={12} md={3} key={playlist.id}>
            <PlaylistCard key={playlist.id} playlist={{ ...playlist }} />
          </Grid>
        );
      })}
    </Grid>
  );
}
