import React, { useState } from 'react';
import { Typography, Grid, TextField, Box, Button } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import AspectRatio from 'components/Utils/AspectRatio';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import ChipEditLine from 'components/Chip/ChipEditLine';
import { AxiosQuery } from 'api';
import { Channel } from 'model/Channel';

export const loader = ({ params }: { params: any }) => {
  return AxiosQuery.Client.channelsGET(params.Id);
};

export interface Props {
  newChannel?: boolean;
}

export function ChannelEdit({ newChannel = false }: Props) {
  let channel: Channel | undefined;
  if (!newChannel) {
    channel = useLoaderData() as Channel;
  }
  const [avatarToUpload, setAvatarToUpload] = useState<File>();
  const [posterToUpload, setPosterToUpload] = useState<File>();

  const channelPostMutation = AxiosQuery.Query.useChannelsPOSTMutation();

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target?.files?.length === 1) {
      setAvatarToUpload(e.target.files[0]);
    }
  };
  const handlePosterChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target?.files?.length === 1) {
      setPosterToUpload(e.target.files[0]);
    }
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    // const description = data.get('description')?.toString()!;
    const name = data.get('name')?.toString()!;
    if (newChannel) {
      channelPostMutation.mutate({
        name,
        avatar: avatarToUpload
          ? { data: avatarToUpload, fileName: avatarToUpload.name }
          : undefined,
        poster: posterToUpload
          ? { data: posterToUpload, fileName: posterToUpload.name }
          : undefined,
        pinnedVideoId: undefined,
      });
    }
  };

  return (
    <Box margin={4} component="form" onSubmit={submitHandler}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Editace kanálu
        </Typography>
        <Box gap={2} display="flex">
          <Button variant="outlined" startIcon={<RestoreIcon />}>
            Zahodit změny
          </Button>
          <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
            Uložit
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3} paddingTop={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="name"
                name="name"
                label="Název"
                fullWidth
                defaultValue={channel?.name}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                required
                id="description"
                name="description"
                label="Popis"
                fullWidth
                defaultValue={channel?.description}
                multiline
                minRows={7}
                maxRows={14}
              />
            </Grid>
  */}
            <Grid item xs={12}>
              <Typography variant="caption" pl={2}>
                Tagy
              </Typography>
              <ChipEditLine />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Poster:</Typography>
          <AspectRatio ratio={16 / 9}>
            <img width="100%" src={channel?.posterUrl ?? posterToUpload} />
          </AspectRatio>
          <Box display="flex" justifyContent="center" gap={2} padding={2}>
            <Button component="label" startIcon={<FileUploadIcon />} variant="outlined">
              <input hidden accept="image/*" type="file" onChange={handlePosterChange} />
              Nahrát
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Avatar:</Typography>
          <AspectRatio ratio={16 / 9}>
            <img width="100%" src={channel?.avatar ?? avatarToUpload} />
          </AspectRatio>
          <Box display="flex" justifyContent="center" gap={2} padding={2}>
            <Button component="label" startIcon={<FileUploadIcon />} variant="outlined">
              <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
              Nahrát
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
