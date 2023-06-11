import { AxiosQuery } from 'api';
import {
  ChannelAdvancedInfoDTO,
  ChannelDTO,
  ChannelUserSpecificInfoDTO,
  WithTotalCountOfPlaylist,
} from 'api/axios-client';

export {
  ChannelDTO as Channel,
  ChannelAdvancedInfoDTO as ChannelAdvancedInfo,
  ChannelUserSpecificInfoDTO as ChannelUserSpecificInfo,
};

export async function getChannelById(id: string): Promise<ChannelDTO> {
  return AxiosQuery.Client.channelsGET(id);
}

export async function getChannelAdvancedInfo(id: string): Promise<ChannelAdvancedInfoDTO> {
  return AxiosQuery.Client.channelAdvancedInfo(id);
}

export async function getChannelUserSpecificInfo(id: string): Promise<ChannelUserSpecificInfoDTO> {
  return AxiosQuery.Client.channelUserInfoGET(id);
}

export async function getChannelPlaylists(id: string): Promise<WithTotalCountOfPlaylist> {
  return AxiosQuery.Client.channelPlaylists(id);
}
