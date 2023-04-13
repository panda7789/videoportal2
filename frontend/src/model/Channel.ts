import { AxiosQuery } from 'api';
import { ChannelAdvancedInfo, ChannelDTO, ChannelUserSpecificInfoDTO } from 'api/axios-client';
import { getPlaylistById, PlaylistModel } from './Playlist';

export {
  ChannelDTO as Channel,
  ChannelAdvancedInfo,
  ChannelUserSpecificInfoDTO as ChannelUserSpecificInfo,
};

export async function getChannelById(id: string): Promise<ChannelDTO> {
  return AxiosQuery.Client.channelsGET(id);
}

export async function getChannelAdvancedInfo(id: string): Promise<ChannelAdvancedInfo> {
  return AxiosQuery.Client.channelAdvancedInfo(id);
}

export async function getChannelUserSpecificInfo(id: string): Promise<ChannelUserSpecificInfoDTO> {
  return AxiosQuery.Client.channelUserInfoGET(id);
}

export async function getChannelPlaylists(id: string): Promise<PlaylistModel[]> {
  const playlists: Promise<PlaylistModel>[] = [];
  for (let i = 0; i < 10; i++) {
    playlists.push(getPlaylistById(id));
  }
  return Promise.all(playlists);
}
