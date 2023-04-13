import { useEffect, useState } from 'react';
import { Grid, Skeleton, Typography } from '@mui/material';
import { getTags } from 'model/Video';
import { Channel, getChannelById } from 'model/Channel';
import { AvatarButton } from 'components/Buttons/AvatarButton';
import CustomChip from 'components/Chip/CustomChip';
import { AxiosQuery } from 'api';
import { ApiPath } from 'components/Utils/APIUtils';
import { VideoInlineList } from 'components/InlineList/VideoInlineList';

function HomePage() {
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const videos = AxiosQuery.Query.useVideosAllQuery(undefined, 5);

  const loadChannels = async () => {
    const x: Channel[] = [];
    for (let i = 0; i < 10; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const channel = await getChannelById('asdf');
      x.push(channel);
    }
    setChannels(x);
  };

  const loadTags = async () => {
    const tag = await getTags();
    setTags(tag);
  };

  useEffect(() => {
    loadChannels();
    loadTags();
  }, []);

  return (
    <Grid container p={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Videa</Typography>
        <Grid container spacing={1} p={2} sx={{ overflow: 'hidden', gridRow: 1 }}>
          <VideoInlineList videos={videos.data} />
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">Populární tagy</Typography>
        <Grid container gap={0.5} pt={1}>
          {tags
            ? tags.map((tag) => <CustomChip key={tag} text={tag} />)
            : [...Array(6)].map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid key={`${i}-skeleton`} item xs={6} p={0.5}>
                  <Skeleton variant="rounded" animation="wave" width="100%" height="32px" />
                </Grid>
              ))}
        </Grid>{' '}
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">Kanály</Typography>
        <Grid container xs={12}>
          {channels
            ? channels?.map((channel) => (
                <Grid item xs={6} key={channel.id}>
                  <AvatarButton
                    key={channel.id}
                    url={`/channel/${channel.id}`}
                    text={channel.name}
                    image={ApiPath(channel.avatarUrl)}
                  />
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
