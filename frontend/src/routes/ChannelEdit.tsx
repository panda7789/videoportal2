import React, { useEffect, useState } from 'react';
import { Typography, Grid, TextField, Box, Button, Autocomplete } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import { AxiosQuery } from 'api';
import { Channel } from 'model/Channel';
import { ApiPath } from 'components/Utils/APIUtils';
import { FileUploadWithPreview } from 'components/Utils/FileUploadWithPreview';
import { useChannelAdvancedInfoQuery } from 'api/axios-client/Query';
import { ChannelDTO } from 'api/axios-client';

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
  const channelAdvancedInfo =
    channel?.id ?? false ? useChannelAdvancedInfoQuery({ id: channel!.id }) : undefined;
  const [avatarToUpload, setAvatarToUpload] = useState<File>();
  const [posterToUpload, setPosterToUpload] = useState<File>();
  const [relatedChannels, setRelatedChannels] = useState<ChannelDTO[]>([]);

  const channelPostMutation = AxiosQuery.Query.useChannelsPOSTMutation();
  const channelPutMutation = AxiosQuery.Query.useChannelsPUTMutation(channel?.id ?? '');
  const allChannelsQuery = AxiosQuery.Query.useChannelsAllQuery();

  useEffect(() => {
    if (
      channelAdvancedInfo?.data?.relatedChannels &&
      channelAdvancedInfo?.data?.relatedChannels?.length > 0
    ) {
      setRelatedChannels(channelAdvancedInfo.data.relatedChannels);
    }
  }, [channelAdvancedInfo?.data]);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const description = data.get('description')?.toString()!;
    const name = data.get('name')?.toString()!;
    if (newChannel) {
      channelPostMutation.mutate({
        name,
        description,
        avatar: avatarToUpload
          ? { data: avatarToUpload, fileName: avatarToUpload.name }
          : undefined,
        poster: posterToUpload
          ? { data: posterToUpload, fileName: posterToUpload.name }
          : undefined,
        pinnedVideoId: undefined,
        relatedChannels: relatedChannels.map((x) => x.id),
      });
    } else {
      channelPutMutation.mutate({
        name,
        description,
        avatar: avatarToUpload
          ? { data: avatarToUpload, fileName: avatarToUpload.name }
          : undefined,
        poster: posterToUpload
          ? { data: posterToUpload, fileName: posterToUpload.name }
          : undefined,
        pinnedVideoId: undefined,
        relatedChannels: relatedChannels.map((x) => x.id),
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
            <Grid item xs={12}>
              <TextField
                id="description"
                name="description"
                label="Popis"
                fullWidth
                defaultValue={channelAdvancedInfo?.data?.description ?? ''}
                multiline
                minRows={2}
                maxRows={14}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography>Poster:</Typography>
          <FileUploadWithPreview
            uploadedFile={posterToUpload}
            setUploadedFile={setPosterToUpload}
            existingImageUrl={ApiPath(channel?.posterUrl)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography>Avatar:</Typography>
          <FileUploadWithPreview
            uploadedFile={avatarToUpload}
            setUploadedFile={setAvatarToUpload}
            existingImageUrl={ApiPath(channel?.avatarUrl)}
          />
        </Grid>
        {allChannelsQuery.isSuccess && (
          <Grid item xs={12} sm={3}>
            <Typography>Připnuté kanály:</Typography>
            <Autocomplete
              multiple
              value={relatedChannels}
              onChange={(event: any, newValue: ChannelDTO[]) => {
                setRelatedChannels(newValue);
              }}
              id="relatedChannels"
              options={allChannelsQuery.data}
              getOptionLabel={(option: ChannelDTO) => option.name}
              isOptionEqualToValue={(option: ChannelDTO, value: ChannelDTO) =>
                option.id === value.id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Vyberte kanál"
                  placeholder="kanál"
                />
              )}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
