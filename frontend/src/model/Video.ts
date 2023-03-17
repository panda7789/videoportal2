import { NumberToWords, TimestampToAgoWords } from 'components/Utils/NumberUtils';
import { v4 as uuidv4 } from 'uuid';

export type UserVideoStats = {
  like?: boolean;
  dislike?: boolean;
  addedToPlaylist?: boolean;
  timeWatchedSec?: number;
};

export type Video = {
  id: string;
  name: string;
  imageUrl: string;
  duration: string;
  description?: string;
  dataUrl: string;
  likeCount: string;
  dislikeCount: string;
  views: string;
  uploadTimestamp: string;
  tags: string[];
};
const tags = [
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
    res.push(tags[Math.floor(Math.random() * tags.length)]);
  }
  return res;
}

export async function getVideoById(id: string): Promise<Video> {
  const random = Math.random() * 256;
  const data: Video = {
    id: uuidv4(),
    name: `Implementace GUI ve Visual Studio (Janoštík)`,
    imageUrl: `https://picsum.photos/320/180?grayscale&random=${random}`,
    duration: '1:05',
    dataUrl: '/sampleVideo.mp4',
    description:
      'Culpa commodo incididunt in sint amet quis deserunt excepteur nisi ex ad veniam nisi anim. Reprehenderit ipsum eiusmod aute sint ipsum deserunt officia id fugiat nostrud.',
    likeCount: NumberToWords(Math.random() * 12345),
    dislikeCount: NumberToWords(Math.random() * 12345),
    views: NumberToWords(Math.random() * 123456789),
    uploadTimestamp: TimestampToAgoWords(Date.parse('2020-12-13T21:01:00.000Z')),
    tags: getTags(),
  };
  return data;
}

export async function search(q: string): Promise<Video[]> {
  console.log(`Searching for ${q}`);
  const arr: Video[] = [];

  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line no-await-in-loop
    const video = await getVideoById(q);
    arr.push({ ...video, id: uuidv4(), name: uuidv4() });
  }

  return arr;
}
