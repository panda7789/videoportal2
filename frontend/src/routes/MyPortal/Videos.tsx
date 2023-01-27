import React from 'react';
import { Box } from '@mui/system';
import { VideoThumbnail } from 'model/Video';
import { useLoaderData } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import EnhancedTable, { Attribute } from 'components/Table/EnhancedTable';

export function MyVideos() {
  const arr = useLoaderData() as VideoThumbnail[];

  const attributes: Attribute<VideoThumbnail>[] = [
    {
      id: 'imageUrl',
      numeric: false,
      disablePadding: false,
      label: 'URL obrázku',
      image: true,
    },
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Název',
    },
    {
      id: 'description',
      numeric: false,
      disablePadding: false,
      label: 'Popis',
    },
    {
      id: 'duration',
      numeric: false,
      disablePadding: false,
      label: 'Délka',
    },
  ];

  return (
    <Box margin={4}>
      <EnhancedTable attributes={attributes} rows={arr} orderBy="id" />
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
