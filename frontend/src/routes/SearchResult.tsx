import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import VideoCard from 'components/Thumbnail/VideoCard';
import { useLoaderData } from 'react-router-dom';
import { SearchQ } from 'components/AppBar/Search';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosQuery } from 'api';

const pageSize = 10;

function SearchResult() {
  const { tags, searchTerm } = useLoaderData() as SearchQ;

  const result = useInfiniteQuery({
    queryKey: [...AxiosQuery.Query.searchMutationKey(searchTerm ?? tags), 'infinite'],
    queryFn: async (params) => {
      const pageParam = params.pageParam ?? (0 as number);
      if (tags) {
        // return AxiosQuery.Client.search(channelId, pageSize, pageParam * pageSize);
        // tags.split(',')
      }
      return AxiosQuery.Client.search(searchTerm, pageSize, pageParam * pageSize);
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.totalCount > pages.length * pageSize ? pages.length : undefined;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <Box marginTop={4} marginBottom={4}>
      {(result?.data?.pages?.length ?? 0) > 0 ? (
        <>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {result?.data?.pages?.map((group, i) => (
              <React.Fragment key={i}>
                {group?.items.map((video) => {
                  return (
                    <Grid key={video.id} item xs={8}>
                      <VideoCard key={video.id} video={video} fullWidth />
                    </Grid>
                  );
                })}
              </React.Fragment>
            ))}
          </Grid>
          {result?.hasNextPage && (
            <Button
              sx={{ width: '100%', mt: '1em' }}
              variant="outlined"
              onClick={() => result.fetchNextPage()}
              disabled={!result.hasNextPage || result.isFetchingNextPage}
            >
              {result.isFetchingNextPage ? 'Načítání...' : 'Načíst další'}
            </Button>
          )}
        </>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {result.status === 'error' && (
            <Typography>{`Bohužel pro výraz '${
              searchTerm ?? tags
            }' nebyl nalezen žádný záznam.`}</Typography>
          )}
        </>
      )}
    </Box>
  );
}
export default SearchResult;
