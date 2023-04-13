import React, { useState } from 'react';
import { Typography, Grid, TextField, Box, Button, MenuItem } from '@mui/material';
import { getVideoById, Video } from 'model/Video';
import { useLoaderData } from 'react-router-dom';
import AspectRatio from 'components/Utils/AspectRatio';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ChipEditLine from 'components/Chip/ChipEditLine';
import FileUpload from 'react-mui-fileuploader';
import { ExtendedFileProps } from 'react-mui-fileuploader/dist/types/index.types';
import nanoMetadata from 'nano-metadata';
import { AxiosQuery } from 'api';
import { v4 } from 'uuid';

export async function loader({ params }: { params: any }) {
  return getVideoById(params);
}

export interface Props {
  newVideo?: boolean;
}

export function VideoEdit({ newVideo = false }: Props) {
  let video: Video | undefined;
  if (!newVideo) {
    video = useLoaderData() as Video;
  }
  const [fileToUpload, setFileToUpload] = useState<ExtendedFileProps>();
  const [imageToUpload, setImageToUpload] = useState<File>();
  const [statusText, setStatusText] = useState<string>();
  const uploadVideoMutation = AxiosQuery.Query.useVideosPOSTMutation();
  const myChannels = AxiosQuery.Query.useMyChannelsQuery();

  const generateThumbnailFromVideo = () => {};
  const handleFilesChange = (files: ExtendedFileProps[]) => {
    setFileToUpload(files[0]);
  };
  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target?.files?.length === 1) {
      setImageToUpload(e.target.files[0]);
    }
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const description = data.get('description')?.toString()!;
    const name = data.get('name')?.toString()!;
    const channelId = data.get('channelSelect')?.toString()!;

    if (!fileToUpload) {
      setStatusText('Nebyl vybrát soubor s videem.');
      return;
    }
    if (!imageToUpload) {
      setStatusText('Nebyl vybrát náhledový obrázek.');
      return;
    }
    const dur = await nanoMetadata.video.duration(fileToUpload);

    uploadVideoMutation.mutate({
      channelId,
      description,
      durationSec: Math.floor(dur),
      name,
      tags: [],
      file: { data: fileToUpload, fileName: fileToUpload.name },
      image: { data: imageToUpload, fileName: imageToUpload.name },
    });
  };

  return (
    <Box margin={4} component="form" onSubmit={submitHandler}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Editace videa
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
        {statusText && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="error">
              {statusText}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3} paddingTop={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="channelSelect"
                select
                required
                label="Kanál"
                defaultValue={myChannels.data?.length === 1 && myChannels.data[0].id}
              >
                {myChannels.data?.map((channel) => (
                  <MenuItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="name"
                name="name"
                label="Název"
                fullWidth
                defaultValue={video?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="description"
                name="description"
                label="Popis"
                fullWidth
                defaultValue={video?.description}
                multiline
                minRows={5}
                maxRows={14}
              />
            </Grid>
            {newVideo && (
              <Grid item xs={12}>
                <Typography variant="caption" pl={2}>
                  Video soubor
                </Typography>
                <FileUpload
                  title=""
                  header="[Přetáhněte soubor sem]"
                  leftLabel="nebo"
                  rightLabel=""
                  buttonLabel="Vyberte soubor"
                  buttonRemoveLabel=""
                  BannerProps={{
                    sx: {
                      backgroundColor: 'primary.main',
                      paddingTop: '1px',
                      paddingBottom: '8px',
                    },
                  }}
                  showPlaceholderImage={false}
                  acceptedType={'video/*'}
                  onFilesChange={handleFilesChange}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Náhledový obrázek:</Typography>
          <AspectRatio ratio={16 / 9}>
            <img width="100%" src={video?.imageUrl ?? imageToUpload} />
          </AspectRatio>
          <Box display="flex" justifyContent="center" gap={2} padding={2}>
            <Button component="label" startIcon={<FileUploadIcon />} variant="outlined">
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              Nahrát
            </Button>
            <Button
              startIcon={<AutorenewIcon />}
              variant="outlined"
              onClick={generateThumbnailFromVideo}
            >
              Vygenerovat
            </Button>
          </Box>
          <Grid item xs={12}>
            <Typography variant="caption" pl={2}>
              Tagy
            </Typography>
            <ChipEditLine />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
