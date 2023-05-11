import { Box, Grid, Typography } from '@mui/material';
import { AxiosQuery } from 'api';
import { AvatarButton } from 'components/Buttons/AvatarButton';
import { ApiPath } from 'components/Utils/APIUtils';
import { NumberToWords } from 'components/Utils/NumberUtils';

export function MyChannels() {
  const arr = AxiosQuery.Query.useMyChannelsQuery().data;

  return (
    <Grid container xs={6} m={4}>
      <Grid item xs={12} pb={2}>
        <Typography variant="h6">Seznam mých kanálů</Typography>
      </Grid>
      {arr &&
        arr.map((channel) => (
          <Grid item xs={12} key={channel.id}>
            <Box display="inline-flex">
              <AvatarButton
                key={channel.id}
                url={`/mychannels/${channel.id}`}
                text={channel.name}
                image={ApiPath(channel.avatarUrl)}
              />
              <Typography>{NumberToWords(channel.subscribersCount ?? 0)} odběratelů</Typography>
            </Box>
          </Grid>
        ))}
      <Grid item xs={12} key="new">
        <AvatarButton
          key="new"
          url="/mychannels/create"
          text="Vytvořit nový kanál"
          customAvatarText="+"
        />
      </Grid>
    </Grid>
  );
}
