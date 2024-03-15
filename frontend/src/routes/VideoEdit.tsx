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
  FormControlLabel,
  Paper,
  useMediaQuery,
  Switch,
  Tooltip,
  IconButton,
} from '@mui/material';
import { getVideoById, Video } from 'model/Video';
import { useLoaderData, useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import HelpIcon from '@mui/icons-material/Help';
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
  useMyUsergroupsQuery,
  useTagsAllQuery,
  useTagsPOSTMutation,
  useUsersAllQuery,
  useVideoPermissionsQuery,
  useVideosPOSTMutation,
  useVideosPUTMutation,
} from 'api/axios-client/Query';
import { PostTagDTO, PostVideoResponse } from 'api/axios-client';
import { SizeToWords } from 'components/Utils/NumberUtils';
import { GetRandomColor } from 'components/Utils/CoolColors';
import { MyPlaylistsDropdown } from 'components/DropDownMenu/MyPlaylistsDropdown';
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator';
import { getFileFromBase64 } from 'components/Utils/FileUtils';
import { UserContext } from './Root';
import { Transfer } from 'antd';
import theme from 'Theme';
import { Route } from 'routes/RouteNames';

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
  const [advancedPermissions, setAdvancedPermissions] = useState(false);
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
  const permissionsQuery = !newVideo ? useVideoPermissionsQuery(video?.id ?? '') : undefined;
  const usersQuery = useUsersAllQuery();
  const groupsQuery = useMyUsergroupsQuery();
  const navigate = useNavigate();
  const [includedUserIds, setIncludedUserIds] = useState<string[] | undefined>(
    permissionsQuery?.data?.includedPermissions?.userIds ?? [],
  );
  const [includedGroupIds, setIncludedGroupIds] = useState<string[] | undefined>(
    permissionsQuery?.data?.includedPermissions?.groupIds ?? [],
  );
  const [excludedUserIds, setExcludedUserIds] = useState<string[] | undefined>(
    permissionsQuery?.data?.excludedPermissions?.userIds ?? [],
  );
  const [excludedGroupIds, setExcludedGroupIds] = useState<string[] | undefined>(
    permissionsQuery?.data?.excludedPermissions?.groupIds ?? [],
  );
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

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

  useEffect(() => {
    if (permissionsQuery?.data) {
      setIncludedUserIds(permissionsQuery.data?.includedPermissions?.userIds);
      setExcludedUserIds(permissionsQuery.data?.excludedPermissions?.userIds);
      setIncludedGroupIds(permissionsQuery.data?.includedPermissions?.groupIds);
      setExcludedGroupIds(permissionsQuery.data?.excludedPermissions?.groupIds);
      if (
        (permissionsQuery.data?.includedPermissions?.userIds?.length ?? 0) > 0 ||
        (permissionsQuery.data?.includedPermissions?.groupIds?.length ?? 0) > 0 ||
        (permissionsQuery.data?.excludedPermissions?.userIds?.length ?? 0) > 0 ||
        (permissionsQuery.data?.excludedPermissions?.groupIds?.length ?? 0) > 0
      ) {
        setAdvancedPermissions(true);
      }
    }
  }, [permissionsQuery?.data]);

  useChunkStartListener((data) => {
    setProgress((data.chunk.index / data.totalCount) * 100);
  });

  useItemFinishListener(() => {
    setProgress(100);
    setUploading(false);
    setStatusText('Video úspěšně nahráno ');
    setTimeout(() => navigate(`/${Route.myVideos}`), 2000);
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

  const handleTagAdd = async (tag: PostTagDTO) => {
    return createTagMutation.mutateAsync(tag);
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
          includedPermissions_UserIds: includedUserIds,
          includedPermissions_GroupIds: includedGroupIds,
          excludedPermissions_UserIds: excludedUserIds,
          excludedPermissions_GroupIds: excludedGroupIds,
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
          includedPermissions_UserIds: includedUserIds,
          includedPermissions_GroupIds: includedGroupIds,
          excludedPermissions_UserIds: excludedUserIds,
          excludedPermissions_GroupIds: excludedGroupIds,
        },
        {
          onSuccess: () => {
            setProgress(100);
            setUploading(false);
            setStatusText('Video úspěšně aktualizováno ️');
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
    <Box margin={{ xs: 1, md: 4 }} component="form" onSubmit={submitHandler}>
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
            <Grid item xs={12}>
              <Box display="inline" pr={1}>
                <FormControlLabel
                  sx={{ pl: 1 }}
                  control={
                    <Switch
                      id="isPublic"
                      name="isPublic"
                      checked={advancedPermissions}
                      onChange={(_, checked) => setAdvancedPermissions(checked)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Pokročilé nastavení oprávnění"
                />
                <Tooltip
                  title="Umožňuje přidávat uživatele/skupiny, kteří mají mít na video právo oproti nastavení z playlistu.
                Kromě toho umožňuje odebrat uživatele/skupiny kteří na video nemají mít právo, ačkoliv na playlist právo mají."
                >
                  <IconButton>
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {advancedPermissions && (
                <Grid container gap={2}>
                  <Paper elevation={2}>
                    <Typography variant="subtitle1" pl={2} pt={1}>
                      Zahrnuté skupiny a uživatelé
                    </Typography>
                    <Grid container p={1} spacing={2}>
                      <Grid item xs={12} minHeight="100px">
                        <Transfer
                          dataSource={groupsQuery.data}
                          showSearch
                          filterOption={(inputValue, option) =>
                            option.name.indexOf(inputValue) > -1
                          }
                          onChange={(newTargetKeys) => setIncludedGroupIds(newTargetKeys)}
                          targetKeys={includedGroupIds}
                          rowKey={(item) => item.id}
                          style={{ width: '100%' }}
                          listStyle={{ width: '100%' }}
                          render={(item) => `${item.name}`}
                          locale={{
                            titles: ['', 'zahrnuté skupiny'],
                            itemsUnit: 'skupiny',
                            itemUnit: 'skupin',
                            notFoundContent: 'Kde nic tu nic',
                            searchPlaceholder: 'Hledat',
                            remove: 'Odebrat',
                            selectAll: 'Vybrat vše',
                            selectCurrent: 'Vybrat aktuální',
                            selectInvert: 'Otočit výběr',
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} minHeight="100px">
                        <Transfer
                          dataSource={usersQuery.data}
                          showSearch
                          filterOption={(inputValue, option) =>
                            option.name.indexOf(inputValue) > -1 ||
                            option.email.indexOf(inputValue) > -1
                          }
                          onChange={(newTargetKeys) => setIncludedUserIds(newTargetKeys)}
                          targetKeys={includedUserIds}
                          rowKey={(item) => item.id}
                          style={{ width: '100%' }}
                          listStyle={{ ...(isDesktop && { width: '100%' }) }}
                          render={(item) => `${item.name}(${item.email})`}
                          locale={{
                            titles: ['', 'zahrnutí uživatelé'],
                            itemsUnit: 'uživatelé',
                            itemUnit: 'uživatel',
                            notFoundContent: 'Kde nic tu nic',
                            searchPlaceholder: 'Hledat',
                            remove: 'Odebrat',
                            selectAll: 'Vybrat vše',
                            selectCurrent: 'Vybrat aktuální',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                  <Paper elevation={2}>
                    <Typography variant="subtitle1" pl={2} pt={1}>
                      Vyloučené skupiny a uživatelé
                    </Typography>
                    <Grid container p={1} spacing={2}>
                      <Grid item xs={12} minHeight="100px">
                        <Transfer
                          dataSource={groupsQuery.data}
                          showSearch
                          filterOption={(inputValue, option) =>
                            option.name.indexOf(inputValue) > -1
                          }
                          onChange={(newTargetKeys) => setExcludedGroupIds(newTargetKeys)}
                          targetKeys={excludedGroupIds}
                          rowKey={(item) => item.id}
                          style={{ width: '100%' }}
                          listStyle={{ width: '100%' }}
                          render={(item) => `${item.name}`}
                          locale={{
                            titles: ['', 'vyloučené skupiny'],
                            itemsUnit: 'skupiny',
                            itemUnit: 'skupin',
                            notFoundContent: 'Kde nic tu nic',
                            searchPlaceholder: 'Hledat',
                            remove: 'Odebrat',
                            selectAll: 'Vybrat vše',
                            selectCurrent: 'Vybrat aktuální',
                            selectInvert: 'Otočit výběr',
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} minHeight="100px">
                        <Transfer
                          dataSource={usersQuery.data}
                          showSearch
                          filterOption={(inputValue, option) =>
                            option.name.indexOf(inputValue) > -1 ||
                            option.email.indexOf(inputValue) > -1
                          }
                          onChange={(newTargetKeys) => setExcludedUserIds(newTargetKeys)}
                          targetKeys={excludedUserIds}
                          rowKey={(item) => item.id}
                          style={{ width: '100%' }}
                          listStyle={{ ...(isDesktop && { width: '100%' }) }}
                          render={(item) => `${item.name}(${item.email})`}
                          locale={{
                            titles: ['', 'vyjmutí uživatelé'],
                            itemsUnit: 'uživatelé',
                            itemUnit: 'uživatel',
                            notFoundContent: 'Kde nic tu nic',
                            searchPlaceholder: 'Hledat',
                            remove: 'Odebrat',
                            selectAll: 'Vybrat vše',
                            selectCurrent: 'Vybrat aktuální',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
            </Grid>
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
                    bgColor: x.color,
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
