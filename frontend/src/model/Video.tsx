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
