import { search, Video } from 'model/Video';
import { v4 } from 'uuid';
import { getPlaylistById, PlaylistModel } from './Playlist';

export interface Channel {
  id: string;
  name: string;
  subscribersCount: number;
  posterUrl: string;
  pinnedVideo?: Video;
}

export interface ChannelAdvancedInfo {
  description: string;
  dateOfRegistration: number;
  email?: string;
  relatedChannels?: Channel[];
}

export interface ChannelUserSpecificInfo {
  subscribed: boolean;
}

export async function getChannelById(id: string): Promise<Channel> {
  await Promise.all([
    // eslint-disable-next-line no-promise-executor-return
    new Promise((r) => setTimeout(r, 200)),
  ]);
  const data: Channel = {
    id: v4(),
    name: 'Olomoucký kraj',
    subscribersCount: 100000,
    posterUrl:
      'https://yt3.googleusercontent.com/5tWmaHeKMT5J18RwhZqIOIyeF4R5zv6-5-8JYZSPbNJgj_9kiVh4t0anH-ZW8xXG4DquECIenK0=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj',
  };
  return data;
}

export async function getChannelAdvancedInfo(id: string): Promise<ChannelAdvancedInfo> {
  const data: ChannelAdvancedInfo = {
    dateOfRegistration: Date.now(),
    description:
      'Ea non nulla do pariatur ex dolore magna sit officia amet nostrud elit.Nostrud exercitation magna laborum incididunt consequat culpa et.Et adipisicing proident commodo deserunt sunt exercitation nostrud est sit proident aute non.',
    email: 'kdojedana@kazma.cz',
    relatedChannels: [await getChannelById(id), await getChannelById('345')],
  };
  return data;
}

export async function getChannelUserSpecificInfo(id: string): Promise<ChannelUserSpecificInfo> {
  return { subscribed: false };
}

export async function getChannelLatestVideos(id: string): Promise<Video[]> {
  return search(id);
}

export async function getChannelPlaylists(id: string): Promise<PlaylistModel[]> {
  const playlists: Promise<PlaylistModel>[] = [];
  for (let i = 0; i < 10; i++) {
    playlists.push(getPlaylistById(id));
  }
  return Promise.all(playlists);
}
