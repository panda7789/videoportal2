import { v4 as uuidv4 } from 'uuid';

export interface Video {
  id: string;
  name: string;
  imageUrl: string;
  dataUrl: string;
  likeCount: number;
  dislikeCount: number;
}

export interface VideoEditModel extends Video {
  imageUrl: string;
  description?: string;
}

export type UserVideoStats = {
  like?: boolean;
  dislike?: boolean;
  addedToPlaylist?: boolean;
  timeWatchedSec?: number;
};

export type VideoThumbnail = {
  id: string;
  name: string;
  imageUrl: string;
  duration: string;
  description?: string;
};

export async function getVideoById(id: string): Promise<Video> {
  await Promise.all([
    // eslint-disable-next-line no-promise-executor-return
    new Promise((r) => setTimeout(r, 200)),
  ]);
  const data: Video = {
    id,
    name: 'Implementace GUI ve Visual Studio (Janoštík)',
    dataUrl: '/sampleVideo.mp4',
    imageUrl: 'https://picsum.photos/1920/1080?grayscale',
    dislikeCount: 0,
    likeCount: 581,
  };
  return data;
}

export async function getVideoThumbnailById(id: string): Promise<VideoThumbnail> {
  const data: VideoThumbnail = {
    id: uuidv4(),
    name: `${id}Implementace GUI ve Visual Studio (Janoštík)`,
    imageUrl: 'https://picsum.photos/1920/1080?grayscale',
    duration: '1:05',
    description:
      'Culpa commodo incididunt in sint amet quis deserunt excepteur nisi ex ad veniam nisi anim. Reprehenderit ipsum eiusmod aute sint ipsum deserunt officia id fugiat nostrud.',
  };
  return data;
}

export async function search(q: string): Promise<VideoThumbnail[]> {
  console.log(`Searching for ${q}`);
  const data: VideoThumbnail = {
    id: uuidv4(),
    name: `${q}Implementace GUI ve Visual Studio (Janoštík)`,
    imageUrl: 'https://picsum.photos/1920/1080?grayscale',
    duration: '1:05',
    description:
      'Culpa commodo incididunt in sint amet quis deserunt excepteur nisi ex ad veniam nisi anim. Reprehenderit ipsum eiusmod aute sint ipsum deserunt officia id fugiat nostrud.',
  };
  const arr: VideoThumbnail[] = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    arr.push(data);
  }

  return arr;
}
