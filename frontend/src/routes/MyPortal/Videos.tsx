import React from 'react';
import { Box } from '@mui/system';
import { VideoThumbnail } from 'model/Video';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

export function MyVideos() {
  const arr = useLoaderData() as VideoThumbnail[];
  const navigate = useNavigate();

  const attributes: Attribute<VideoThumbnail>[] = [
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
  const data: VideoThumbnail = {
    id: uuidv4(),
    name: `Implementace GUI ve Visual Studio (Janoštík)`,
    imageUrl: 'https://picsum.photos/1920/1080?grayscale',
    duration: '1:05',
    description:
      'Culpa commodo incididunt in sint amet quis deserunt excepteur nisi ex ad veniam nisi anim. Reprehenderit ipsum eiusmod aute sint ipsum deserunt officia id fugiat nostrud.',
  };
  const arr: VideoThumbnail[] = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    arr.push({ ...data, id: uuidv4() });
  }

  return arr;
}
