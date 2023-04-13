import { UserVideoStats } from 'api/axios-client';
import { v4 as uuidv4 } from 'uuid';
import { AxiosQuery } from 'api';
import { PlaylistModel } from './Playlist';
import { VideoDTO } from '../api/axios-client';

export { UserVideoStats };

export { VideoDTO as Video };

const tagsExamples = [
  'Aplikovaná informatika',
  'Přednáška',
  'Konference',
  'Matematika',
  'Akce',
  'Ostatní',
  'XBP1',
  'KTE2',
  'MAT4',
];
export function getTags() {
  const res = [];
  for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
    res.push(tagsExamples[Math.floor(Math.random() * tagsExamples.length)]);
  }
  return res;
}

export async function getVideoById(id: string): Promise<VideoDTO> {
  return AxiosQuery.Client.videosGET(id);
}

export async function search(q: string): Promise<VideoDTO[]> {
  console.log(`Searching for ${q}`);
  const arr: VideoDTO[] = [];

  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line no-await-in-loop
    const video = await getVideoById(q);
    arr.push(new Video({ ...video, id: uuidv4(), name: uuidv4() }));
  }

  return arr;
}

export async function searchTags(tags: string[]): Promise<Video[]> {
  console.log(`Searching for tags: ${tags.toString()}`);
  const arr: Video[] = [];

  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line no-await-in-loop
    const video = await getVideoById('A');
    arr.push(new Video({ ...video, id: uuidv4(), name: uuidv4() }));
  }

  return arr;
}

export function videoUrl(video: Video) {
  return `/video/${video.id}`;
}

export function playlistParams(playlist: PlaylistModel, index: number) {
  return `?playlist=${playlist.id}&index=${index}`;
}
