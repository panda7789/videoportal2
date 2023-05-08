import React, { forwardRef, useState } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  MenuItem,
  LinearProgress,
  FormLabel,
} from '@mui/material';
import { getVideoById, Video } from 'model/Video';
import { useLoaderData } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import ChipEditLine from 'components/Chip/ChipEditLine';
import nanoMetadata from 'nano-metadata';
import ChunkedUploady, {
  useBatchAddListener,
  useUploadyContext,
  useItemFinishListener,
  useChunkStartListener,
  useItemErrorListener,
} from '@rpldy/chunked-uploady';
import { asUploadButton } from '@rpldy/upload-button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { AxiosQuery } from 'api';
import { FileUploadWithPreview } from 'components/Utils/FileUploadWithPreview';
import { ApiPath } from 'components/Utils/APIUtils';
import { uploadUrl } from 'api/axios-client/Query';
import { PostVideoResponse } from 'api/axios-client';
import { SizeToWords } from 'components/Utils/NumberUtils';

export async function loader({ params }: { params: any }) {
  return getVideoById(params.videoId);
}

export interface Props {
  newVideo?: boolean;
}

interface InnerProps {
  newVideo?: boolean;
}

const CustomUploadButton = asUploadButton(
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-unused-vars
  forwardRef((props, ref) => (
    <Button
      {...props}
      style={{ cursor: 'pointer' }}
      variant="outlined"
      startIcon={<FileUploadIcon />}
    />
  )),
);

function VideoEditInner({ newVideo }: InnerProps) {
  let video: Video | undefined;
  if (!newVideo) {
    video = useLoaderData() as Video;
  }
  const [imageToUpload, setImageToUpload] = useState<File>();
  const [statusText, setStatusText] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileUploadInfo, setFileUploadInfo] = useState<{
    name: string;
    size: string;
    duration: number;
  }>();

  const uploadVideoMutation = AxiosQuery.Query.useVideosPOSTMutation();
  const updateVideoMutation = AxiosQuery.Query.useVideosPUTMutation(video?.id ?? '');
  const myChannels = AxiosQuery.Query.useMyChannelsQuery();
  const uploady = useUploadyContext();

  useChunkStartListener((data) => {
    setProgress((data.chunk.index / data.totalCount) * 100);
  });

  useItemFinishListener(() => {
    setProgress(100);
    setUploading(false);
    setStatusText('Video úspěšně nahráno ☺️');
  });
  useItemErrorListener(() => {
    setUploading(false);
    setStatusText('Video se nepodařilo nahrát 😥');
  });
  useBatchAddListener((batch) => {
    (async () => {
      if (batch.items.length === 1) {
        const { file } = batch.items[0];
        const dur = await nanoMetadata.video.duration(file);
        setFileUploadInfo({
          name: file.name,
          size: SizeToWords(file.size),
          duration: dur,
        });
      }
    })();
  });
  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const description = data.get('description')?.toString()!;
    const name = data.get('name')?.toString()!;
    const channelId = data.get('channelSelect')?.toString()!;

    if (newVideo) {
      if (!imageToUpload) {
        setStatusText('Nebyl vybrát náhledový obrázek.');
        return;
      }
      if (!fileUploadInfo) {
        setStatusText('Nebyl vybrát soubor s videem.');
        return;
      }
      setUploading(true);

      uploadVideoMutation.mutate(
        {
          channelId,
          description,
          durationSec: Math.floor(fileUploadInfo.duration),
          name,
          tags: [],
          fileName: fileUploadInfo.name,
          image: imageToUpload ? { data: imageToUpload, fileName: imageToUpload.name } : undefined,
        },
        {
          onSuccess: (res: PostVideoResponse) => {
            const token = localStorage.getItem('token');

            if (!token) {
              setUploading(false);
              setStatusText('Došlo k odhlášení, prosím přihlaste se znovu.');
            }
            uploady.processPending({
              destination: { headers: { 'x-guid': res.dataUrl, authorization: `Bearer ${token}` } },
            });
          },
          onError: () => {
            setUploading(false);
            setStatusText(`Video se nepodařilo nahrát 😥`);
          },
        },
      );
    } else {
      setUploading(true);

      updateVideoMutation.mutate(
        {
          channelId,
          description,
          name,
          tags: [],
          image: imageToUpload ? { data: imageToUpload, fileName: imageToUpload.name } : undefined,
        },
        {
          onSuccess: () => {
            setProgress(100);
            setUploading(false);
            setStatusText('Video úspěšně aktualizováno ☺️');
          },
          onError: () => {
            setUploading(false);
            setStatusText(`Video se nepodařilo aktualizovat 😥`);
          },
        },
      );
    }
  };

  return (
    <Box margin={4} component="form" onSubmit={submitHandler}>
      {uploading && (
        <Box sx={{ width: '100%' }} pt={2} pb={2}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
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
            <Typography
              variant="subtitle1"
              color={
                ((newVideo && uploadVideoMutation.isSuccess) || true) && progress === 100
                  ? 'success.main'
                  : 'error'
              }
            >
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
                defaultValue={
                  video?.channelId ?? (myChannels.data?.length === 1 ? myChannels.data[0].id : '')
                }
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
                <fieldset
                  style={{
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    borderWidth: '1px',
                    borderRadius: '4px',
                    position: 'relative',
                    padding: 0,
                  }}
                >
                  <FormLabel
                    style={{
                      transform: 'translate(10px, -9px) scale(0.75)',
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      transformOrigin: 'top left',
                      zIndex: '1',
                      backgroundColor: 'white',
                      paddingLeft: '4px',
                      paddingRight: '4px',
                    }}
                  >
                    Video soubor
                  </FormLabel>
                  <Box p={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography>{fileUploadInfo?.name ?? 'Nebyl vybrán soubor'}</Typography>
                      <Typography variant="caption">{fileUploadInfo?.size ?? ''}</Typography>
                    </Box>
                    <Box pt={1}>
                      <CustomUploadButton
                        autoUpload={false}
                        extraProps={{ type: 'button' }}
                        text="Nahrát"
                      />
                    </Box>
                  </Box>
                </fieldset>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Náhledový obrázek:</Typography>
          <FileUploadWithPreview
            uploadedFile={imageToUpload}
            setUploadedFile={setImageToUpload}
            existingImageUrl={ApiPath(video?.imageUrl)}
          />
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

export function VideoEdit({ newVideo = false }: Props) {
  return (
    <ChunkedUploady
      method="POST"
      chunkSize={1e7}
      destination={{ url: uploadUrl() }}
      accept="video/*"
    >
      <VideoEditInner newVideo={newVideo} />
    </ChunkedUploady>
  );
}
