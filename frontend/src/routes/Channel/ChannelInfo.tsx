import { Box, Grid, Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { ChannelAdvancedInfo, getChannelAdvancedInfo } from 'model/Channel';
import { AvatarButton } from 'components/Buttons/AvatarButton';

export async function loader({ params }: { params: any }) {
  return getChannelAdvancedInfo(params.channelId);
}

export function ChannelInfo() {
  const info = useLoaderData() as ChannelAdvancedInfo;

  return (
    <Grid container spacing={2}>
      <Grid item xs={7} columns={2}>
        <Typography variant="h6" mb={1}>
          Informace o kanálu
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <Typography variant="caption">Popis:</Typography>
            <Typography>{info.description}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Datum registrace:</Typography>
            <Typography>{info.dateOfRegistration.toLocaleString()}</Typography>
          </Box>
          <Box>
            {info.email && (
              <>
                <Typography variant="caption">Kontaktní email:</Typography>
                <Typography>{info.email}</Typography>
              </>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={5}>
        <Typography variant="h6" mb={1}>
          Připnuté kanály
        </Typography>
        <Box display="flex" flexDirection="column">
          {info.relatedChannels?.map((channel) => (
            <AvatarButton
              key={channel.id}
              url={`/channel/${channel.id}`}
              text={channel.name}
              image={ApiUrl(channel.avatar)}
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  );
}
