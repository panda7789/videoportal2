import React, { forwardRef, useContext, useState, useEffect, useRef } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  LinearProgress,
  FormLabel,
  Alert,
} from '@mui/material';
import { getVideoById, Video } from 'model/Video';
import { useLoaderData } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import ChipEditLine, { ChipData, ChipLineFunctions } from 'components/Chip/ChipEditLine';
import nanoMetadata from 'nano-metadata';
import ChunkedUploady, {
  useBatchAddListener,
  useUploadyContext,
  useItemFinishListener,
  useChunkStartListener,
  useItemErrorListener,
} from '@rpldy/chunked-uploady';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { asUploadButton } from '@rpldy/upload-button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { FileUploadWithPreview } from 'components/Utils/FileUploadWithPreview';
import { ApiPath } from 'components/Utils/APIUtils';
import {
  uploadUrl,
  useTagsAllQuery,
  useTagsPOSTMutation,
  useVideosPOSTMutation,
  useVideosPUTMutation,
} from 'api/axios-client/Query';
import { PostVideoResponse } from 'api/axios-client';
import { SizeToWords } from 'components/Utils/NumberUtils';
import { GetRandomColor } from 'components/Utils/CoolColors';
import { MyPlaylistsDropdown } from 'components/DropDownMenu/MyPlaylistsDropdown';
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator';
import { getFileFromBase64 } from 'components/Utils/FileUtils';
import { UserContext } from './Root';

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
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>();
  const tagsRef = useRef<ChipLineFunctions>(null);
  const userContext = useContext(UserContext);

  const uploadVideoMutation = useVideosPOSTMutation();
  const updateVideoMutation = useVideosPUTMutation(video?.id ?? '');
  const uploady = useUploadyContext();
  const allTagsQuery = useTagsAllQuery({ refetchOnWindowFocus: false });
  const createTagMutation = useTagsPOSTMutation();

  const selectRandomThumbnail = () => {
    if (!generatedThumbnails) {
      return;
    }
    setImageToUpload(
      getFileFromBase64(
        generatedThumbnails[Math.floor(Math.random() * generatedThumbnails.length)],
        'generatedThumbnail.jpeg',
      ),
    );
  };

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
        setImageToUpload(undefined);
        generateVideoThumbnails(file as File, 5, 'file').then((thumbnailArray: string[]) => {
          setGeneratedThumbnails(thumbnailArray);
        });
      }
    })();
  });

  useEffect(() => {
    selectRandomThumbnail();
  }, [generatedThumbnails]);
  const handleTagAdd = async (name: string) => {
    return createTagMutation.mutateAsync(name);
  };

  const thumbnailAdditionalButtons = [
    <Button
      key="regenerateButton"
      component="label"
      startIcon={<AutorenewIcon />}
      variant="outlined"
      onClick={() => {
        selectRandomThumbnail();
      }}
    >
      Přegenerovat náhled
    </Button>,
  ];

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const description = data.get('description')?.toString()!;
    const name = data.get('name')?.toString()!;
    const tags = tagsRef?.current?.getActiveChips()?.map((x) => x.label) ?? [];
    const playlistId = data.get('playlistSelect')?.toString()!;

    if (newVideo) {
      if (!imageToUpload) {
        setStatusText('Nebyl vybrán náhledový obrázek.');
        return;
      }
      if (!fileUploadInfo) {
        setStatusText('Nebyl vybrán soubor s videem.');
        return;
      }
      setUploading(true);

      uploadVideoMutation.mutate(
        {
          description,
          durationSec: Math.floor(fileUploadInfo.duration),
          name,
          tags,
          fileName: fileUploadInfo.name,
          image: imageToUpload ? { data: imageToUpload, fileName: imageToUpload.name } : undefined,
          playlistId,
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
          description,
          name,
          tags,
          image: imageToUpload ? { data: imageToUpload, fileName: imageToUpload.name } : undefined,
          playlistId,
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
  useEffect(() => {
    if (!userContext?.isLoading && !userContext?.user)
      throw new Error('Nejste přihlášení nebo nemáte oprávnění editovat video.');
  }, [userContext?.user, userContext?.isLoading]);

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
        <Grid item xs={12}>
          {statusText && <Alert severity="info">{statusText}</Alert>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3} paddingTop={3}>
            <Grid item xs={12}>
              <MyPlaylistsDropdown defaultValue={video?.mainPlaylistId} required />
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
            additionalButtons={thumbnailAdditionalButtons}
          />
          <Grid item xs={12}>
            <Typography variant="caption" pl={2}>
              Tagy
            </Typography>
            <ChipEditLine
              chips={allTagsQuery?.data?.map(
                (x) =>
                  ({
                    active: video?.tags?.some((y) => y.name === x.name),
                    bgColor: GetRandomColor(),
                    key: x.id,
                    label: x.name,
                  } as ChipData),
              )}
              addChipHandle={handleTagAdd}
              ref={tagsRef}
            />
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
