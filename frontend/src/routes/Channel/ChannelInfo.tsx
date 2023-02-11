import React from 'react';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { Link, useLoaderData } from 'react-router-dom';
import { ChannelAdvancedInfo, getChannelAdvancedInfo } from 'model/Channel';

export async function loader({ params }: { params: any }) {
  return getChannelAdvancedInfo('asdf');
}

export function ChannelInfo() {
  const info = useLoaderData() as ChannelAdvancedInfo;

  return (
    <Grid container spacing={2}>
      <Grid item xs={7} columns={2}>
        <Typography variant="h6" mb={1}>
          Informace o kanálu
        </Typography>
        <Box display="grid" gridTemplateColumns="1fr 3fr" gap={2}>
          <Typography variant="caption">Popis:</Typography>
          <Typography>{info.description}</Typography>
          <Typography variant="caption">Datum registrace:</Typography>
          <Typography>{info.dateOfRegistration}</Typography>
          {info.email && (
            <>
              <Typography variant="caption">Kontaktní email:</Typography>
              <Typography>{info.email}</Typography>
            </>
          )}
        </Box>
      </Grid>
      <Grid item xs={5}>
        <Typography variant="h6" mb={1}>
          Připnuté kanály
        </Typography>
        <Box display="flex" flexDirection="column">
          {info.relatedChannels?.map((channel) => (
            <Box
              key={channel.id}
              display="flex"
              alignItems="center"
              component={Link}
              to={`/channel/${channel.id}`}
              padding="4px !important"
              sx={{
                textDecoration: 'none',
                color: 'unset',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                borderRadius: '15px',
              }}
            >
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  border: '0.1px solid lightgray',
                  padding: '4px',
                  img: { objectFit: 'fill', borderRadius: '50%' },
                }}
                src="/upol.png"
              />
              <Typography paddingLeft={1}>{channel.name}</Typography>
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
}
