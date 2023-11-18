import { Grid, Skeleton, Typography } from '@mui/material';
import { AvatarButton } from 'components/Buttons/AvatarButton';
import CustomChip from 'components/Chip/CustomChip';
import { VideoInlineList } from 'components/InlineList/VideoInlineList';
import { usePlaylistsAllQuery, useTagsAllQuery, useVideosAllQuery } from 'api/axios-client/Query';
import { Route } from 'routes/RouteNames';
import { PlaylistCard } from 'components/Thumbnail/PlaylistCard';

function HomePage() {
  const videos = useVideosAllQuery(undefined, 5);
  const playlists = usePlaylistsAllQuery(undefined, 20);
  const tags = useTagsAllQuery();

  return (
    <Grid container p={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Nejnovější videa</Typography>
        <Grid container spacing={1} p={2} sx={{ overflow: 'hidden', gridRow: 1 }}>
          <VideoInlineList videos={videos.data} showChannel />
        </Grid>
      </Grid>
      <Grid item xs={12} md={3}>
        <Typography variant="h6">Tagy</Typography>
        <Grid container gap={0.5} pt={1} direction={{ xs: 'row', md: 'column' }}>
          {tags?.data
            ? tags?.data.map((tag) => <CustomChip key={tag.id} text={tag.name} />)
            : [...Array(6)].map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid key={`${i}-skeleton`} item xs={12} p={0.5}>
                  <Skeleton variant="rounded" animation="wave" width="100%" height="32px" />
                </Grid>
              ))}
        </Grid>{' '}
      </Grid>
      <Grid item xs={12} md={9}>
        <Typography variant="h6">Playlisty</Typography>
        <Grid container gap={1}>
          {!playlists.isLoading
            ? playlists?.data?.map((playlist) => (
                <Grid item xs={3} key={playlist.id}>
                  <PlaylistCard playlist={playlist} smallThumbnail />
                </Grid>
              ))
            : [...Array(6)].map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid key={`${i}-skeleton`} item xs={6} p={0.5}>
                  <Skeleton variant="rounded" animation="wave" width="100%" height="64px" />
                </Grid>
              ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
export default HomePage;
