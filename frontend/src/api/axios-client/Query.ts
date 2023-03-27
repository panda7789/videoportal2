//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming
import * as Types from '../axios-client';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryResult, QueryFunctionContext, UseQueryOptions, QueryClient, QueryKey, MutationKey, UseMutationOptions, UseMutationResult, QueryMeta, MutationMeta } from '@tanstack/react-query';
import { trimArrayEnd, isParameterObject, getBaseUrl, addMetaToOptions  } from './helpers';
import type { QueryMetaContextValue } from 'react-query-swagger';
import { QueryMetaContext } from 'react-query-swagger';
import { useContext } from 'react';
import * as Client from './Client'
export { Client };
import type { AxiosRequestConfig } from 'axios';

export type ChannelsGETQueryParameters = {
  id: string;
};

export type ChannelsPOSTMutationParameters = {
  name?: string | null | undefined ; 
  poster?: Types.FileParameter | null | undefined ; 
  pinnedVideoId?: string | null | undefined ; 
  avatar?: Types.FileParameter | null | undefined ; 
};

export type VideosPOSTMutationParameters = {
  file?: Types.FileParameter | null | undefined ; 
  name?: string | null | undefined ; 
  description?: string | null | undefined ; 
  durationSec?: number | undefined ; 
  image?: Types.FileParameter | null | undefined ; 
  channelId?: string | undefined ; 
  tags?: Types.Tag[] | null | undefined ; 
};

export type VideosGETQueryParameters = {
  id: string;
};

    
export function myChannelsUrl(): string {
  let url_ = getBaseUrl() + "/api/Channels/my-channels";
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

let myChannelsDefaultOptions: UseQueryOptions<Types.ChannelDTO[], unknown, Types.ChannelDTO[]> = {
  queryFn: __myChannels,
};
export function getMyChannelsDefaultOptions(): UseQueryOptions<Types.ChannelDTO[], unknown, Types.ChannelDTO[]> {
  return myChannelsDefaultOptions;
};
export function setMyChannelsDefaultOptions(options: UseQueryOptions<Types.ChannelDTO[], unknown, Types.ChannelDTO[]>) {
  myChannelsDefaultOptions = options;
}

export function myChannelsQueryKey(): QueryKey;
export function myChannelsQueryKey(...params: any[]): QueryKey {
  return trimArrayEnd([
      'Client',
      'myChannels',
    ]);
}
function __myChannels() {
  return Client.myChannels(
    );
}

/**
 * @return Success
 */
export function useMyChannelsQuery<TSelectData = Types.ChannelDTO[], TError = unknown>(options?: UseQueryOptions<Types.ChannelDTO[], TError, TSelectData>, axiosConfig?: Partial<AxiosRequestConfig>): UseQueryResult<TSelectData, TError>;
export function useMyChannelsQuery<TSelectData = Types.ChannelDTO[], TError = unknown>(...params: any []): UseQueryResult<TSelectData, TError> {
  let options: UseQueryOptions<Types.ChannelDTO[], TError, TSelectData> | undefined = undefined;
  let axiosConfig: AxiosRequestConfig |undefined;
  

  options = params[0] as any;
  axiosConfig = params[1] as any;

  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  if (axiosConfig) {
    options = options ?? { } as any;
    options!.meta = { ...options!.meta, axiosConfig };
  }

  return useQuery<Types.ChannelDTO[], TError, TSelectData>({
    queryFn: __myChannels,
    queryKey: myChannelsQueryKey(),
    ...myChannelsDefaultOptions as unknown as UseQueryOptions<Types.ChannelDTO[], TError, TSelectData>,
    ...options,
  });
}
/**
 * @return Success
 */
export function setMyChannelsData(queryClient: QueryClient, updater: (data: Types.ChannelDTO[] | undefined) => Types.ChannelDTO[], ) {
  queryClient.setQueryData(myChannelsQueryKey(),
    updater
  );
}

/**
 * @return Success
 */
export function setMyChannelsDataByQueryId(queryClient: QueryClient, queryKey: QueryKey, updater: (data: Types.ChannelDTO[] | undefined) => Types.ChannelDTO[]) {
  queryClient.setQueryData(queryKey, updater);
}
    
    
export function channelsGETUrl(id: string): string {
  let url_ = getBaseUrl() + "/api/Channels/{id}";

if (id === undefined || id === null)
  throw new Error("The parameter 'id' must be defined.");
url_ = url_.replace("{id}", encodeURIComponent("" + id));
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

let channelsGETDefaultOptions: UseQueryOptions<Types.ChannelDTO, unknown, Types.ChannelDTO> = {
  queryFn: __channelsGET,
};
export function getChannelsGETDefaultOptions(): UseQueryOptions<Types.ChannelDTO, unknown, Types.ChannelDTO> {
  return channelsGETDefaultOptions;
};
export function setChannelsGETDefaultOptions(options: UseQueryOptions<Types.ChannelDTO, unknown, Types.ChannelDTO>) {
  channelsGETDefaultOptions = options;
}

export function channelsGETQueryKey(id: string): QueryKey;
export function channelsGETQueryKey(...params: any[]): QueryKey {
  if (params.length === 1 && isParameterObject(params[0])) {
    const { id,  } = params[0] as ChannelsGETQueryParameters;

    return trimArrayEnd([
        'Client',
        'channelsGET',
        id as any,
      ]);
  } else {
    return trimArrayEnd([
        'Client',
        'channelsGET',
        ...params
      ]);
  }
}
function __channelsGET(context: QueryFunctionContext) {
  return Client.channelsGET(
      context.queryKey[2] as string    );
}

export function useChannelsGETQuery<TSelectData = Types.ChannelDTO, TError = unknown>(dto: ChannelsGETQueryParameters, options?: UseQueryOptions<Types.ChannelDTO, TError, TSelectData>, axiosConfig?: Partial<AxiosRequestConfig>): UseQueryResult<TSelectData, TError>;
/**
 * @return Success
 */
export function useChannelsGETQuery<TSelectData = Types.ChannelDTO, TError = unknown>(id: string, options?: UseQueryOptions<Types.ChannelDTO, TError, TSelectData>, axiosConfig?: Partial<AxiosRequestConfig>): UseQueryResult<TSelectData, TError>;
export function useChannelsGETQuery<TSelectData = Types.ChannelDTO, TError = unknown>(...params: any []): UseQueryResult<TSelectData, TError> {
  let options: UseQueryOptions<Types.ChannelDTO, TError, TSelectData> | undefined = undefined;
  let axiosConfig: AxiosRequestConfig |undefined;
  let id: any = undefined;
  
  if (params.length > 0) {
    if (isParameterObject(params[0])) {
      ({ id,  } = params[0] as ChannelsGETQueryParameters);
      options = params[1];
      axiosConfig = params[2];
    } else {
      [id, options, axiosConfig] = params;
    }
  }

  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  if (axiosConfig) {
    options = options ?? { } as any;
    options!.meta = { ...options!.meta, axiosConfig };
  }

  return useQuery<Types.ChannelDTO, TError, TSelectData>({
    queryFn: __channelsGET,
    queryKey: channelsGETQueryKey(id),
    ...channelsGETDefaultOptions as unknown as UseQueryOptions<Types.ChannelDTO, TError, TSelectData>,
    ...options,
  });
}
/**
 * @return Success
 */
export function setChannelsGETData(queryClient: QueryClient, updater: (data: Types.ChannelDTO | undefined) => Types.ChannelDTO, id: string) {
  queryClient.setQueryData(channelsGETQueryKey(id),
    updater
  );
}

/**
 * @return Success
 */
export function setChannelsGETDataByQueryId(queryClient: QueryClient, queryKey: QueryKey, updater: (data: Types.ChannelDTO | undefined) => Types.ChannelDTO) {
  queryClient.setQueryData(queryKey, updater);
}
    
    
export function channelsPUTUrl(id: string): string {
  let url_ = getBaseUrl() + "/api/Channels/{id}";

if (id === undefined || id === null)
  throw new Error("The parameter 'id' must be defined.");
url_ = url_.replace("{id}", encodeURIComponent("" + id));
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

export function channelsPUTMutationKey(id: string): MutationKey {
  return trimArrayEnd([
      'Client',
      'channelsPUT',
      id as any,
    ]);
}

/**
 * @param body (optional) 
 * @return Success
 */
export function useChannelsPUTMutation<TContext>(id: string, options?: Omit<UseMutationOptions<void, unknown, Types.ChannelDTO, TContext>, 'mutationKey' | 'mutationFn'>): UseMutationResult<void, unknown, Types.ChannelDTO, TContext> {
  const key = channelsPUTMutationKey(id);
  
  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  
      return useMutation((body: Types.ChannelDTO) => Client.channelsPUT(id, body), {...options, mutationKey: key});
}
  
    
export function channelsDELETEUrl(id: string): string {
  let url_ = getBaseUrl() + "/api/Channels/{id}";

if (id === undefined || id === null)
  throw new Error("The parameter 'id' must be defined.");
url_ = url_.replace("{id}", encodeURIComponent("" + id));
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

export function channelsDELETEMutationKey(id: string): MutationKey {
  return trimArrayEnd([
      'Client',
      'channelsDELETE',
      id as any,
    ]);
}

/**
 * @return Success
 */
export function useChannelsDELETEMutation<TContext>(id: string, options?: Omit<UseMutationOptions<void, unknown, void, TContext>, 'mutationKey' | 'mutationFn'>): UseMutationResult<void, unknown, void, TContext> {
  const key = channelsDELETEMutationKey(id);
  
  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  
      return useMutation(() => Client.channelsDELETE(id), {...options, mutationKey: key});
}
  
    
export function channelsPOSTUrl(): string {
  let url_ = getBaseUrl() + "/api/Channels";
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

export function channelsPOSTMutationKey(): MutationKey {
  return trimArrayEnd([
      'Client',
      'channelsPOST',
    ]);
}

/**
 * @param name (optional) 
 * @param poster (optional) 
 * @param pinnedVideoId (optional) 
 * @param avatar (optional) 
 * @return Success
 */
export function useChannelsPOSTMutation<TContext>(options?: Omit<UseMutationOptions<Types.ChannelDTO, unknown, ChannelsPOSTMutationParameters, TContext>, 'mutationKey' | 'mutationFn'>): UseMutationResult<Types.ChannelDTO, unknown, ChannelsPOSTMutationParameters, TContext> {
  const key = channelsPOSTMutationKey();
  
  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  
      return useMutation((channelsPOSTMutationParameters: ChannelsPOSTMutationParameters) => Client.channelsPOST(channelsPOSTMutationParameters.name, channelsPOSTMutationParameters.poster, channelsPOSTMutationParameters.pinnedVideoId, channelsPOSTMutationParameters.avatar), {...options, mutationKey: key});
}
  
    
export function loginUrl(): string {
  let url_ = getBaseUrl() + "/api/users/login";
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

export function loginMutationKey(): MutationKey {
  return trimArrayEnd([
      'Client',
      'login',
    ]);
}

/**
 * @param body (optional) 
 * @return Success
 */
export function useLoginMutation<TContext>(options?: Omit<UseMutationOptions<string, unknown, Types.LoginDTO, TContext>, 'mutationKey' | 'mutationFn'>): UseMutationResult<string, unknown, Types.LoginDTO, TContext> {
  const key = loginMutationKey();
  
  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  
      return useMutation((body: Types.LoginDTO) => Client.login(body), {...options, mutationKey: key});
}
  
    
export function registerUrl(): string {
  let url_ = getBaseUrl() + "/api/users/register";
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

export function registerMutationKey(): MutationKey {
  return trimArrayEnd([
      'Client',
      'register',
    ]);
}

/**
 * @param body (optional) 
 * @return Success
 */
export function useRegisterMutation<TContext>(options?: Omit<UseMutationOptions<string, unknown, Types.RegisterDTO, TContext>, 'mutationKey' | 'mutationFn'>): UseMutationResult<string, unknown, Types.RegisterDTO, TContext> {
  const key = registerMutationKey();
  
  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  
      return useMutation((body: Types.RegisterDTO) => Client.register(body), {...options, mutationKey: key});
}
  
    
export function meUrl(): string {
  let url_ = getBaseUrl() + "/api/users/me";
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

let meDefaultOptions: UseQueryOptions<Types.UserDTO, unknown, Types.UserDTO> = {
  queryFn: __me,
};
export function getMeDefaultOptions(): UseQueryOptions<Types.UserDTO, unknown, Types.UserDTO> {
  return meDefaultOptions;
};
export function setMeDefaultOptions(options: UseQueryOptions<Types.UserDTO, unknown, Types.UserDTO>) {
  meDefaultOptions = options;
}

export function meQueryKey(): QueryKey;
export function meQueryKey(...params: any[]): QueryKey {
  return trimArrayEnd([
      'Client',
      'me',
    ]);
}
function __me() {
  return Client.me(
    );
}

/**
 * @return Success
 */
export function useMeQuery<TSelectData = Types.UserDTO, TError = unknown>(options?: UseQueryOptions<Types.UserDTO, TError, TSelectData>, axiosConfig?: Partial<AxiosRequestConfig>): UseQueryResult<TSelectData, TError>;
export function useMeQuery<TSelectData = Types.UserDTO, TError = unknown>(...params: any []): UseQueryResult<TSelectData, TError> {
  let options: UseQueryOptions<Types.UserDTO, TError, TSelectData> | undefined = undefined;
  let axiosConfig: AxiosRequestConfig |undefined;
  

  options = params[0] as any;
  axiosConfig = params[1] as any;

  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  if (axiosConfig) {
    options = options ?? { } as any;
    options!.meta = { ...options!.meta, axiosConfig };
  }

  return useQuery<Types.UserDTO, TError, TSelectData>({
    queryFn: __me,
    queryKey: meQueryKey(),
    ...meDefaultOptions as unknown as UseQueryOptions<Types.UserDTO, TError, TSelectData>,
    ...options,
  });
}
/**
 * @return Success
 */
export function setMeData(queryClient: QueryClient, updater: (data: Types.UserDTO | undefined) => Types.UserDTO, ) {
  queryClient.setQueryData(meQueryKey(),
    updater
  );
}

/**
 * @return Success
 */
export function setMeDataByQueryId(queryClient: QueryClient, queryKey: QueryKey, updater: (data: Types.UserDTO | undefined) => Types.UserDTO) {
  queryClient.setQueryData(queryKey, updater);
}
    
    
export function videosAllUrl(): string {
  let url_ = getBaseUrl() + "/api/Videos";
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

let videosAllDefaultOptions: UseQueryOptions<Types.Video[], unknown, Types.Video[]> = {
  queryFn: __videosAll,
};
export function getVideosAllDefaultOptions(): UseQueryOptions<Types.Video[], unknown, Types.Video[]> {
  return videosAllDefaultOptions;
};
export function setVideosAllDefaultOptions(options: UseQueryOptions<Types.Video[], unknown, Types.Video[]>) {
  videosAllDefaultOptions = options;
}

export function videosAllQueryKey(): QueryKey;
export function videosAllQueryKey(...params: any[]): QueryKey {
  return trimArrayEnd([
      'Client',
      'videosAll',
    ]);
}
function __videosAll() {
  return Client.videosAll(
    );
}

/**
 * @return Success
 */
export function useVideosAllQuery<TSelectData = Types.Video[], TError = unknown>(options?: UseQueryOptions<Types.Video[], TError, TSelectData>, axiosConfig?: Partial<AxiosRequestConfig>): UseQueryResult<TSelectData, TError>;
export function useVideosAllQuery<TSelectData = Types.Video[], TError = unknown>(...params: any []): UseQueryResult<TSelectData, TError> {
  let options: UseQueryOptions<Types.Video[], TError, TSelectData> | undefined = undefined;
  let axiosConfig: AxiosRequestConfig |undefined;
  

  options = params[0] as any;
  axiosConfig = params[1] as any;

  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  if (axiosConfig) {
    options = options ?? { } as any;
    options!.meta = { ...options!.meta, axiosConfig };
  }

  return useQuery<Types.Video[], TError, TSelectData>({
    queryFn: __videosAll,
    queryKey: videosAllQueryKey(),
    ...videosAllDefaultOptions as unknown as UseQueryOptions<Types.Video[], TError, TSelectData>,
    ...options,
  });
}
/**
 * @return Success
 */
export function setVideosAllData(queryClient: QueryClient, updater: (data: Types.Video[] | undefined) => Types.Video[], ) {
  queryClient.setQueryData(videosAllQueryKey(),
    updater
  );
}

/**
 * @return Success
 */
export function setVideosAllDataByQueryId(queryClient: QueryClient, queryKey: QueryKey, updater: (data: Types.Video[] | undefined) => Types.Video[]) {
  queryClient.setQueryData(queryKey, updater);
}
    
    
export function videosPOSTUrl(): string {
  let url_ = getBaseUrl() + "/api/Videos";
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

export function videosPOSTMutationKey(): MutationKey {
  return trimArrayEnd([
      'Client',
      'videosPOST',
    ]);
}

/**
 * @param file (optional) 
 * @param name (optional) 
 * @param description (optional) 
 * @param durationSec (optional) 
 * @param image (optional) 
 * @param channelId (optional) 
 * @param tags (optional) 
 * @return Success
 */
export function useVideosPOSTMutation<TContext>(options?: Omit<UseMutationOptions<Types.Video, unknown, VideosPOSTMutationParameters, TContext>, 'mutationKey' | 'mutationFn'>): UseMutationResult<Types.Video, unknown, VideosPOSTMutationParameters, TContext> {
  const key = videosPOSTMutationKey();
  
  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  
      return useMutation((videosPOSTMutationParameters: VideosPOSTMutationParameters) => Client.videosPOST(videosPOSTMutationParameters.file, videosPOSTMutationParameters.name, videosPOSTMutationParameters.description, videosPOSTMutationParameters.durationSec, videosPOSTMutationParameters.image, videosPOSTMutationParameters.channelId, videosPOSTMutationParameters.tags), {...options, mutationKey: key});
}
  
    
export function videosGETUrl(id: string): string {
  let url_ = getBaseUrl() + "/api/Videos/{id}";

if (id === undefined || id === null)
  throw new Error("The parameter 'id' must be defined.");
url_ = url_.replace("{id}", encodeURIComponent("" + id));
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

let videosGETDefaultOptions: UseQueryOptions<Types.Video, unknown, Types.Video> = {
  queryFn: __videosGET,
};
export function getVideosGETDefaultOptions(): UseQueryOptions<Types.Video, unknown, Types.Video> {
  return videosGETDefaultOptions;
};
export function setVideosGETDefaultOptions(options: UseQueryOptions<Types.Video, unknown, Types.Video>) {
  videosGETDefaultOptions = options;
}

export function videosGETQueryKey(id: string): QueryKey;
export function videosGETQueryKey(...params: any[]): QueryKey {
  if (params.length === 1 && isParameterObject(params[0])) {
    const { id,  } = params[0] as VideosGETQueryParameters;

    return trimArrayEnd([
        'Client',
        'videosGET',
        id as any,
      ]);
  } else {
    return trimArrayEnd([
        'Client',
        'videosGET',
        ...params
      ]);
  }
}
function __videosGET(context: QueryFunctionContext) {
  return Client.videosGET(
      context.queryKey[2] as string    );
}

export function useVideosGETQuery<TSelectData = Types.Video, TError = unknown>(dto: VideosGETQueryParameters, options?: UseQueryOptions<Types.Video, TError, TSelectData>, axiosConfig?: Partial<AxiosRequestConfig>): UseQueryResult<TSelectData, TError>;
/**
 * @return Success
 */
export function useVideosGETQuery<TSelectData = Types.Video, TError = unknown>(id: string, options?: UseQueryOptions<Types.Video, TError, TSelectData>, axiosConfig?: Partial<AxiosRequestConfig>): UseQueryResult<TSelectData, TError>;
export function useVideosGETQuery<TSelectData = Types.Video, TError = unknown>(...params: any []): UseQueryResult<TSelectData, TError> {
  let options: UseQueryOptions<Types.Video, TError, TSelectData> | undefined = undefined;
  let axiosConfig: AxiosRequestConfig |undefined;
  let id: any = undefined;
  
  if (params.length > 0) {
    if (isParameterObject(params[0])) {
      ({ id,  } = params[0] as VideosGETQueryParameters);
      options = params[1];
      axiosConfig = params[2];
    } else {
      [id, options, axiosConfig] = params;
    }
  }

  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  if (axiosConfig) {
    options = options ?? { } as any;
    options!.meta = { ...options!.meta, axiosConfig };
  }

  return useQuery<Types.Video, TError, TSelectData>({
    queryFn: __videosGET,
    queryKey: videosGETQueryKey(id),
    ...videosGETDefaultOptions as unknown as UseQueryOptions<Types.Video, TError, TSelectData>,
    ...options,
  });
}
/**
 * @return Success
 */
export function setVideosGETData(queryClient: QueryClient, updater: (data: Types.Video | undefined) => Types.Video, id: string) {
  queryClient.setQueryData(videosGETQueryKey(id),
    updater
  );
}

/**
 * @return Success
 */
export function setVideosGETDataByQueryId(queryClient: QueryClient, queryKey: QueryKey, updater: (data: Types.Video | undefined) => Types.Video) {
  queryClient.setQueryData(queryKey, updater);
}
    
    
export function videosPUTUrl(id: string): string {
  let url_ = getBaseUrl() + "/api/Videos/{id}";

if (id === undefined || id === null)
  throw new Error("The parameter 'id' must be defined.");
url_ = url_.replace("{id}", encodeURIComponent("" + id));
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

export function videosPUTMutationKey(id: string): MutationKey {
  return trimArrayEnd([
      'Client',
      'videosPUT',
      id as any,
    ]);
}

/**
 * @param body (optional) 
 * @return Success
 */
export function useVideosPUTMutation<TContext>(id: string, options?: Omit<UseMutationOptions<void, unknown, Types.Video, TContext>, 'mutationKey' | 'mutationFn'>): UseMutationResult<void, unknown, Types.Video, TContext> {
  const key = videosPUTMutationKey(id);
  
  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  
      return useMutation((body: Types.Video) => Client.videosPUT(id, body), {...options, mutationKey: key});
}
  
    
export function videosDELETEUrl(id: string): string {
  let url_ = getBaseUrl() + "/api/Videos/{id}";

if (id === undefined || id === null)
  throw new Error("The parameter 'id' must be defined.");
url_ = url_.replace("{id}", encodeURIComponent("" + id));
  url_ = url_.replace(/[?&]$/, "");
  return url_;
}

export function videosDELETEMutationKey(id: string): MutationKey {
  return trimArrayEnd([
      'Client',
      'videosDELETE',
      id as any,
    ]);
}

/**
 * @return Success
 */
export function useVideosDELETEMutation<TContext>(id: string, options?: Omit<UseMutationOptions<void, unknown, void, TContext>, 'mutationKey' | 'mutationFn'>): UseMutationResult<void, unknown, void, TContext> {
  const key = videosDELETEMutationKey(id);
  
  const metaContext = useContext(QueryMetaContext);
  options = addMetaToOptions(options, metaContext);
  
      return useMutation(() => Client.videosDELETE(id), {...options, mutationKey: key});
}