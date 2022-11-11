export type Video = {
  id: string;
  name: string;
  imageUrl: string;
  dataUrl: string;
  likeCount: number;
  dislikeCount: number;
};

export type UserVideoStats = {
  like?: boolean;
  dislike?: boolean;
  addedToPlaylist?: boolean;
  timeWatchedSec?: number;
};

export type VideoThumbnail = {
  id: string;
  name: string;
  url?: string;
  imageUrl: string;
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
    imageUrl: 'https://picsum.photos/1920/1080',
    dislikeCount: 0,
    likeCount: 581,
  };
  return data;
}
