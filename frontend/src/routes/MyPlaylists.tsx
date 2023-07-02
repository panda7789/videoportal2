import React, { useState } from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useMyPlaylistsQuery } from 'api/axios-client/Query';
import { PlaylistDTO, VideoDTO } from 'api/axios-client';
import AddIcon from '@mui/icons-material/Add';
import { Route } from 'routes/RouteNames';
import DeleteIcon from '@mui/icons-material/Delete';
import { AxiosQuery } from 'api';
import { Alert, Typography } from '@mui/material';
import { Grid } from 'react-loader-spinner';
import { ApiPath } from 'components/Utils/APIUtils';
import AspectRatio from 'components/Utils/AspectRatio';

function MyPlaylistsThumbnail(row: PlaylistDTO) {
  return (
    <AspectRatio ratio={16 / 9}>
      <img
        alt="Náhled playlistu"
        style={{ maxHeight: '100%', width: '100%', objectFit: 'contain' }}
        src={ApiPath(
          row?.thumbnailUrl
            ? row.thumbnailUrl
            : row?.videos?.length
            ? row?.videos[0].imageUrl
            : undefined,
        )}
      />
    </AspectRatio>
  );
}

// eslint-disable-next-line import/prefer-default-export
export function MyPlaylists() {
  const playlistQuery = useMyPlaylistsQuery();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState<string>();

  const attributes: Attribute<PlaylistDTO>[] = [
    {
      id: 'thumbnailUrl',
      label: 'Náhled',
      imageCustomElement: (row: PlaylistDTO) => MyPlaylistsThumbnail(row),
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
      id: 'videos',
      label: 'Počet videí',
      customFormat: (value: VideoDTO[]) => {
        return value?.length.toString() ?? 0;
      },
    },
  ];

  const buttons: ToolbarButton[] = [];
  buttons.push({
    label: 'Smazat',
    icon: <DeleteIcon />,
    onClick: (selectedIDs: readonly string[]) => {
      setStatusText(undefined);
      const promises = Promise.all(selectedIDs.map((id) => AxiosQuery.Client.playlistsDELETE(id)));
      promises
        .then(() => {
          playlistQuery.refetch();
          setStatusText('Playlist úspěšně smazán');
        })
        .catch(() => {
          setStatusText('Playlist se nepodařilo smazat');
        });
    },
  });

  const staticButtons: ToolbarButton[] = [
    {
      icon: <AddIcon />,
      label: 'Vytvořit nový playlist',
      onClick: () => navigate(`/${Route.myPlaylists}/create`),
    },
  ];

  const rowClick = (event: React.MouseEvent<unknown>, id: string) => {
    navigate({
      pathname: `/${Route.myPlaylists}/${id}`,
    });
  };

  return (
    <Box margin={4}>
      {statusText && <Alert severity="info">{statusText}</Alert>}
      {playlistQuery.data && (
        <EnhancedTable
          attributes={attributes}
          rows={playlistQuery.data}
          orderBy="createdTimestamp"
          desc="desc"
          buttons={buttons}
          staticButtons={staticButtons}
          rowClick={rowClick}
        />
      )}
    </Box>
  );
}
