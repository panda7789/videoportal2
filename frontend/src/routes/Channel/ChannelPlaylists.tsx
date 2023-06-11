import React from 'react';
import { Grid } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { PlaylistCard } from 'components/Thumbnail/PlaylistCard';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosQuery } from 'api';

export async function loader({ params }: { params: any }) {
  return params.channelId;
}
const pageSize = 8;

export function ChannelPlaylists() {
  const channelId = useLoaderData() as string;

  const playlists = useInfiniteQuery({
    queryKey: [...AxiosQuery.Query.channelPlaylistsQueryKey({ id: channelId }), 'infinite'],
    queryFn: async (params) => {
      const pageParam = params.pageParam ?? (0 as number);
      return AxiosQuery.Client.channelPlaylists(channelId, pageSize, pageParam * pageSize);
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.totalCount > pages.length * pageSize ? pages.length : undefined;
    },
    refetchOnWindowFocus: false,
  });
  return (
    <Grid container spacing={1}>
      {playlists?.data?.pages?.map((group, i) => (
        <React.Fragment key={i}>
          {group?.items.map((playlist) => {
            return (
              <Grid item xs={12} md={3} key={playlist.id}>
                <PlaylistCard key={playlist.id} playlist={{ ...playlist }} />
              </Grid>
            );
          })}
        </React.Fragment>
      ))}
    </Grid>
  );
}
