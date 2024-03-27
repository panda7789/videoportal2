import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Video } from 'model/Video';
import { useNavigate } from 'react-router-dom';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import { useMyVideosQuery } from 'api/axios-client/Query';
import { Route } from 'routes/RouteNames';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { Alert } from '@mui/material';
import { AxiosQuery } from 'api';
import { UserContext } from 'routes/Root';

// eslint-disable-next-line import/prefer-default-export
export function MyVideos() {
  const userContext = useContext(UserContext);
  const myVideosQuery = useMyVideosQuery({
    queryKey: ['Client', 'myVideos', userContext?.user?.id],
  });
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState<string>();

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
  buttons.push({
    label: 'Smazat',
    color: 'error',
    icon: <DeleteIcon />,
    onClick: (selectedIDs: readonly string[]) => {
      setStatusText(undefined);
      const promises = Promise.all(selectedIDs.map((id) => AxiosQuery.Client.videosDELETE(id)));
      promises
        .then(() => {
          myVideosQuery.refetch();
          setStatusText('Video úspěšně smazáno');
        })
        .catch(() => {
          setStatusText('Video se nepodařilo smazat');
        });
    },
  });

  const rowClick = (event: React.MouseEvent<unknown>, id: string) => {
    navigate({
      pathname: `/${Route.videoEdit}/${id}`,
    });
  };

  useEffect(() => {
    if (!userContext?.isLoading && !userContext?.user) throw new Error('Nejste přihlášení.');
  }, [userContext?.user, userContext?.isLoading]);

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
    </Box>
  );
}
