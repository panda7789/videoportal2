import React from 'react';
import VideoCard from 'components/Thumbnail/VideoCard';
import { Button, Grid } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosQuery } from 'api';

export async function loader({ params }: { params: any }) {
  return params.channelId;
}

const pageSize = 8;

export function ChannelVideos() {
  const channelId = useLoaderData() as string;

  const videos = useInfiniteQuery({
    queryKey: [...AxiosQuery.Query.channelVideosQueryKey({ id: channelId }), 'infinite'],
    queryFn: async (params) => {
      const pageParam = params.pageParam ?? (0 as number);
      return AxiosQuery.Client.channelVideos(channelId, pageSize, pageParam * pageSize);
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.totalCount > pages.length * pageSize ? pages.length : undefined;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Grid container spacing={1}>
        {videos?.data?.pages?.map((group, i) => (
          <React.Fragment key={i}>
            {group?.items.map((video) => {
              return (
                <Grid item xs={12} md={3} key={video.id}>
                  <VideoCard key={video.id} video={video} showChannel={false} />
                </Grid>
              );
            })}
          </React.Fragment>
        ))}
      </Grid>
      {videos.hasNextPage && (
        <Button
          sx={{ width: '100%', mt: '1em' }}
          variant="outlined"
          onClick={() => videos.fetchNextPage()}
          disabled={!videos.hasNextPage || videos.isFetchingNextPage}
        >
          {videos.isFetchingNextPage ? 'Načítání...' : 'Načíst další'}
        </Button>
      )}
    </>
  );
}
