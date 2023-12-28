import React, { useState } from 'react';
import { Box } from '@mui/system';
import { Video } from 'model/Video';
import { useNavigate } from 'react-router-dom';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useMyPlaylistsQuery, useMyVideosQuery } from 'api/axios-client/Query';
import { Route } from 'routes/RouteNames';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import { AxiosQuery } from 'api';

// eslint-disable-next-line import/prefer-default-export
export function MyVideos() {
  const myVideosQuery = useMyVideosQuery();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState<string>();
  const [addToPlaylistDialogOpen, setAddToPlaylistDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>();
  const [selectedIds, setSelectedIds] = useState<readonly string[]>();
  const myPlaylistsQuery = useMyPlaylistsQuery();

  const attributes: Attribute<Video>[] = [
    {
      id: 'imageUrl',
      label: 'URL obrázku',
      image: true,
    },
    {
      id: 'name',
      label: 'Název',
    },
    {
      id: 'description',
      label: 'Popis',
    },
    {
      id: 'duration',
      label: 'Délka',
    },
    {
      id: 'uploadTimestamp',
      label: 'Datum nahrání',
      customFormat: (value: Date) => {
        return value.toLocaleString();
      },
    },
  ];

  const staticButtons: ToolbarButton[] = [
    {
      icon: <AddIcon />,
      label: 'Nahrát video',
      onClick: () => navigate(`/${Route.upload}/`),
    },
  ];

  const buttons: ToolbarButton[] = [];
  buttons.push(
    {
      label: 'Přidat do playlistu',
      icon: <PlaylistAddIcon />,
      onClick: (_selectedIDs: readonly string[]) => {
        setSelectedIds(_selectedIDs);
        setAddToPlaylistDialogOpen(true);
        setStatusText(undefined);
      },
    },
    {
      label: 'Smazat',
      color: 'error',
      icon: <DeleteIcon />,
      onClick: (selectedIDs: readonly string[]) => {
        setStatusText(undefined);
        const promises = Promise.all(selectedIDs.map((id) => AxiosQuery.Client.videosDELETE(id)));
        promises
          .then(() => {
            myVideosQuery.refetch();
            setStatusText('Video úspěšně smazán');
          })
          .catch(() => {
            setStatusText('Video se nepodařilo smazat');
          });
      },
    },
  );

  const rowClick = (event: React.MouseEvent<unknown>, id: string) => {
    navigate({
      pathname: `/${Route.videoEdit}/${id}`,
    });
  };

  const handleDialogClose = () => {
    setAddToPlaylistDialogOpen(false);
  };

  const handleAddToPlaylist = () => {
    if (!selectedIds || !selectedPlaylist) {
      return;
    }
    Promise.all(
      selectedIds.map((videoId) => AxiosQuery.Client.video(selectedPlaylist, videoId, true)),
    )
      .then(() => setStatusText('Videa byly úspěšně přidány do playlistu'))
      .catch(() => setStatusText('Videa se nepovedlo přidat do playlistu'))
      .finally(() => handleDialogClose());
  };

  return (
    <Box margin={4}>
      {statusText && (
        <Box mb={1}>
          <Alert severity="info">{statusText}</Alert>
        </Box>
      )}
      {myVideosQuery?.data && (
        <EnhancedTable
          attributes={attributes}
          rows={myVideosQuery.data}
          orderBy="uploadTimestamp"
          desc="desc"
          buttons={buttons}
          rowClick={rowClick}
          staticButtons={staticButtons}
        />
      )}
      <Dialog
        onClose={(e: any) => {
          e.stopPropagation();
          handleDialogClose();
        }}
        open={addToPlaylistDialogOpen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Přidat do playlistu</DialogTitle>
        <DialogContent onClick={(e: React.MouseEvent<any, MouseEvent>) => e.stopPropagation()}>
          <FormControl fullWidth>
            <Select
              id="addtoPlayList"
              onChange={(e) => setSelectedPlaylist(e.target.value as string)}
            >
              {myPlaylistsQuery?.data?.map((playlist) => {
                return (
                  <MenuItem key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Zavřít</Button>
          <Button onClick={handleAddToPlaylist}>Přidat do playlistu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
