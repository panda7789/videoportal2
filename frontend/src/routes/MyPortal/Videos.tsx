import React from 'react';
import { Box } from '@mui/system';
import { getVideoById, Video } from 'model/Video';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

export function MyVideos() {
  const arr = useLoaderData() as Video[];
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
  ];

  const buttons: ToolbarButton[] = [];
  buttons.push({
    label: 'Přidat do playlistu',
    icon: <PlaylistAddIcon />,
    onClick: (selectedIDs: readonly string[]) => {
      console.log(selectedIDs);
      navigate({
        pathname: `/video/${selectedIDs[0]}`,
      });
    },
  });

  const rowClick = (event: React.MouseEvent<unknown>, id: string) => {
    console.log(id);
    navigate({
      pathname: `/videoedit/${id}`,
    });
  };

  return (
    <Box margin={4}>
      <EnhancedTable
        attributes={attributes}
        rows={arr}
        orderBy="id"
        buttons={buttons}
        rowClick={rowClick}
      />
    </Box>
  );
}

export async function loader() {
  const arr: Video[] = [];

  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line no-await-in-loop
    arr.push(await getVideoById('1234'));
  }

  return arr;
}
