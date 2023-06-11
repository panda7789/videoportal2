import React from 'react';
import { Box } from '@mui/system';
import { Video } from 'model/Video';
import { useNavigate } from 'react-router-dom';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useMyVideosQuery } from 'api/axios-client/Query';
import { Route } from 'routes/RouteNames';

// eslint-disable-next-line import/prefer-default-export
export function MyVideos() {
  const arr = useMyVideosQuery().data;
  const navigate = useNavigate();

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

  const buttons: ToolbarButton[] = [];
  buttons.push({
    label: 'Přidat do playlistu',
    icon: <PlaylistAddIcon />,
    onClick: (selectedIDs: readonly string[]) => {
      console.log(selectedIDs);
      navigate({
        pathname: `/${Route.video}/${selectedIDs[0]}`,
      });
    },
  });

  const rowClick = (event: React.MouseEvent<unknown>, id: string) => {
    navigate({
      pathname: `/${Route.videoEdit}/${id}`,
    });
  };

  return (
    <Box margin={4}>
      {arr && (
        <EnhancedTable
          attributes={attributes}
          rows={arr}
          orderBy="uploadTimestamp"
          desc="desc"
          buttons={buttons}
          rowClick={rowClick}
        />
      )}
    </Box>
  );
}
