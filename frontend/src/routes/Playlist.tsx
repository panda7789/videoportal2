import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ScrollToTop from 'components/Utils/ScrollOnTop';
import { VerticalList } from 'components/VerticalList/VerticalList';
import { AxiosQuery } from 'api';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import { PlaylistDTO, VideoDTO } from 'api/axios-client';
import { FileUploadWithPreview } from 'components/Utils/FileUploadWithPreview';
import { ApiPath } from 'components/Utils/APIUtils';
import {
  usePlaylistsDELETEMutation,
  usePlaylistsPOSTMutation,
  usePlaylistsPUTMutation,
} from 'api/axios-client/Query';
import { UserContext } from 'routes/Root';
import { playlistParams, videoUrl } from 'model/Video';
import { Route } from 'routes/RouteNames';

export const loader = ({ params }: { params: any }) => {
  return AxiosQuery.Client.playlistsGET(params.Id);
};

export interface Props {
  newPlaylist?: boolean;
}

export function PlaylistDetail({ newPlaylist }: Props) {
  let playlistProp: PlaylistDTO | undefined;
  if (!newPlaylist) {
    playlistProp = useLoaderData() as PlaylistDTO;
  }
  const userContext = useContext(UserContext);
  const [playlist, setPlaylist] = useState<PlaylistDTO>(playlistProp ?? new PlaylistDTO());
  const [editMode, setEditMode] = useState(newPlaylist ?? false);
  const [canEdit, setCanEdit] = useState(false);
  const [imageToUpload, setImageToUpload] = useState<File>();
  const [statusText, setStatusText] = useState<string>();
  const navigate = useNavigate();

  const createPlaylistMutation = usePlaylistsPOSTMutation();
  const updatePlaylistMutation = usePlaylistsPUTMutation(playlist.id);
  const deletePlaylistMutation = usePlaylistsDELETEMutation(playlist.id, {
    onSuccess: () => {
      setStatusText('Playlist úspěšně smazán.');
      setTimeout(() => navigate({ pathname: `/${Route.myPlaylists}` }), 2000);
    },
    onError: () => {
      setStatusText(`Playlist se nepodařilo smazat.`);
    },
  });
  useLayoutEffect(() => ScrollToTop(), [playlist.id]);

  const onListDragEnd = (videos: VideoDTO[]) => {
    setPlaylist(new PlaylistDTO({ ...playlist, videos }));
  };

  const toggleEditMode = (value: boolean) => {
    setEditMode(value);
  };

  useEffect(() => {
    setCanEdit(playlistProp?.owner.id === userContext?.user?.id ?? 0);
  }, [playlistProp, userContext]);
  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const description = data.get('description')?.toString()!;
    const name = data.get('name')?.toString()!;

    if (newPlaylist) {
      createPlaylistMutation.mutate(
        {
          name,
          description,
          thumbnail: imageToUpload
            ? { data: imageToUpload, fileName: imageToUpload.name }
            : undefined,
        },
        {
          onSuccess: () => {
            const token = localStorage.getItem('token');
            if (!token) {
              setStatusText('Došlo k odhlášení, prosím přihlaste se znovu.');
            }
            setStatusText('Playlist úspěšně založen.');
          },
          onError: () => {
            setStatusText(`Playlist se nepodařilo založit 😥`);
          },
        },
      );
    } else {
      updatePlaylistMutation.mutate(
        {
          name,
          description,
          thumbnail: imageToUpload
            ? { data: imageToUpload, fileName: imageToUpload.name }
            : undefined,
        },
        {
          onSuccess: () => {
            setStatusText('Playlist úspěšně aktualizován ☺️');
          },
          onError: () => {
            setStatusText(`Playlist se nepodařilo aktualizovat 😥`);
          },
        },
      );
    }
  };
  return (
    <Box margin={4}>
      <Grid container xs={12} sx={{ alignItems: 'flex-start' }}>
        <Grid
          item
          position={{ xs: 'initial', md: 'fixed' }}
          width={{ xs: '100%', md: editMode ? 'calc(100%/2.5)' : 'calc(100%/4.4)' }}
        >
          {statusText && <Alert severity="info">{statusText}</Alert>}
          <Box component="form" onSubmit={submitHandler}>
            {editMode && (
              <Box
                display="flex"
                position="absolute"
                zIndex={1}
                right={0}
                justifyContent="space-between"
              >
                <Box gap={2} display="flex" pt={1}>
                  <Button
                    variant="outlined"
                    startIcon={<RestoreIcon />}
                    onClick={() => toggleEditMode(false)}
                  >
                    Zahodit změny
                  </Button>
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                    Uložit
                  </Button>
                </Box>
              </Box>
            )}
            <Box width={editMode ? '60%' : undefined} pt={editMode ? 4 : 1}>
              {editMode && <Typography>Náhledový obrázek:</Typography>}
              <FileUploadWithPreview
                uploadedFile={imageToUpload}
                setUploadedFile={setImageToUpload}
                existingImageUrl={ApiPath(
                  playlist?.thumbnailUrl
                    ? playlist.thumbnailUrl
                    : playlist?.videos?.length
                    ? playlist?.videos[0].imageUrl
                    : undefined,
                )}
                readOnly={!editMode}
              />
            </Box>
            {!editMode && (
              <Box display="flex" justifyContent="space-between" pt={1} pb={2}>
                <Button
                  startIcon={<PlayArrowIcon />}
                  variant="contained"
                  component={Link}
                  to={
                    playlist?.videos?.length
                      ? videoUrl(playlist?.videos[0]) + playlistParams(playlist, 0)
                      : ''
                  }
                >
                  Přehrát vše
                </Button>
                {canEdit && (
                  <>
                    <Button
                      startIcon={<EditIcon />}
                      variant="contained"
                      onClick={() => toggleEditMode(true)}
                    >
                      Upravit
                    </Button>
                    <Button
                      startIcon={<DeleteForeverIcon />}
                      variant="contained"
                      color="error"
                      onClick={() => deletePlaylistMutation.mutate()}
                    />
                  </>
                )}
              </Box>
            )}
            {editMode ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="name"
                    name="name"
                    label="Název"
                    fullWidth
                    defaultValue={playlist?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    id="description"
                    name="description"
                    label="Popis"
                    fullWidth
                    defaultValue={playlist?.description}
                    multiline
                    minRows={2}
                    maxRows={3}
                  />
                </Grid>
              </Grid>
            ) : (
              <Box>
                <Typography variant="body1" padding={2} pt={0} pl={0}>
                  Název: {playlist?.name}
                </Typography>
                <Typography variant="body1" padding={2} pl={0}>
                  Popis: {playlist?.description}
                </Typography>
              </Box>
            )}
            {!editMode && (
              <Typography variant="body1" padding={2} pl={0}>
                Celková délka: {playlist?.totalDuration ?? '00:00'}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <Box
        sx={{ paddingLeft: editMode ? 'calc(100% / 1.8)' : 'calc(100% / 3)' }}
        pt={3}
        height="75vh"
      >
        <VerticalList
          videos={playlist?.videos ?? []}
          onDragEnd={onListDragEnd}
          draggable={editMode}
          emptyText="Přidávat videa lze přímo z detailu videa, přes volbu Přidat do playlistu"
          urlParamsGenerator={(_, index) => playlistParams(playlist, index)}
        />
      </Box>
    </Box>
  );
}
