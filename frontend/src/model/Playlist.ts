import { search, VideoThumbnail } from 'model/Video';
import { v4 as uuidv4 } from 'uuid';

export interface Playlist {
  id: string;
  name: string;
  thumbnailUrl: string;
  videos: VideoThumbnail[];
  duration: string;
  description?: string;
}

export async function getPlaylistById(id: string): Promise<Playlist> {
  await Promise.all([
    // eslint-disable-next-line no-promise-executor-return
    new Promise((r) => setTimeout(r, 200)),
  ]);
  const data: Playlist = {
    id: uuidv4(),
    name: 'Přehrát později',
    thumbnailUrl: 'https://picsum.photos/1920/1080?grayscale',
    videos: await search('asdf'),
    duration: '12:34:56',
    description: 'Commodo irure amet eu magna veniam incididunt do exercitation laboris.',
  };
  return data;
}
