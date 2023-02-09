import { v4 as uuidv4, v4 } from 'uuid';

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
  dataUrl: string;
};

export interface Video extends VideoThumbnail {
  likeCount: number;
  dislikeCount: number;
}

export async function getVideoThumbnailById(id: string): Promise<VideoThumbnail> {
  const random = Math.random() * 256;
  const data: VideoThumbnail = {
    id: uuidv4(),
    name: `Implementace GUI ve Visual Studio (Janoštík)`,
    imageUrl: `https://picsum.photos/320/180?grayscale&random=${random}`,
    duration: '1:05',
    dataUrl: '/sampleVideo.mp4',
    description:
      'Culpa commodo incididunt in sint amet quis deserunt excepteur nisi ex ad veniam nisi anim. Reprehenderit ipsum eiusmod aute sint ipsum deserunt officia id fugiat nostrud.',
  };
  return data;
}

export async function getVideoById(id: string): Promise<Video> {
  await Promise.all([
    // eslint-disable-next-line no-promise-executor-return
    new Promise((r) => setTimeout(r, 200)),
  ]);
  const videoThumb = await getVideoThumbnailById(id);
  const data: Video = {
    ...videoThumb,
    dislikeCount: 0,
    likeCount: 581,
  };
  return data;
}

export async function search(q: string): Promise<VideoThumbnail[]> {
  console.log(`Searching for ${q}`);
  const arr: VideoThumbnail[] = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line no-await-in-loop
    const video = await getVideoThumbnailById(q);
    arr.push({ ...video, id: uuidv4(), name: uuidv4() });
  }

  return arr;
}
