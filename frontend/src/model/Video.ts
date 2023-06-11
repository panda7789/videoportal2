import { UserVideoStats } from 'api/axios-client';
import { AxiosQuery } from 'api';
import { Route } from 'routes/RouteNames';
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
  // eslint-disable-next-line no-template-curly-in-string
  return AxiosQuery.Client.search(
    `${q
      .toString()
      .trim()
      .substring(0, q.length > 20 ? 20 : q.length)}`,
  );
}

export async function searchTags(tags: string[]): Promise<VideoDTO[]> {
  console.log(`Searching for tags: ${tags.toString()}`);
  return [];
}

export function videoUrl(video: VideoDTO) {
  return `/${Route.video}/${video.id}`;
}

export function playlistParams(playlist: PlaylistModel, index: number) {
  return `?playlist=${playlist.id}&index=${index}`;
}
