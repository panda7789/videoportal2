import React from 'react';
import { PlaylistCard } from 'components/Thumbnail/PlaylistCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import { LinkButton } from 'components/Buttons/LinkButton';
import { playlistParams, videoUrl } from 'model/Video';
import { PlaylistBasicInfoDTO, PlaylistDTO } from 'api/axios-client';
import { Route } from 'routes/RouteNames';
import { InlineList } from './InlineList';
import { VideoInlineList } from './VideoInlineList';

export interface Props {
  playlists: PlaylistBasicInfoDTO[];
}

export function PlaylistInlineList({ playlists }: Props) {
  return (
    <InlineList>
      {playlists.map((_playlist) => (
        <PlaylistCard key={_playlist.id} playlist={_playlist} smallThumbnail />
      ))}
    </InlineList>
  );
}

export interface ExtendedProps {
  playlist: PlaylistDTO;
  currentlyPlaying?: number;
  editable?: boolean;
  showPlayAllButton?: boolean;
}

export function ExpandedPlaylistInlineList({
  playlist,
  currentlyPlaying,
  editable,
  showPlayAllButton,
}: ExtendedProps) {
  return playlist?.videos?.length ? (
    <Box>
      <Typography variant="h6" display="inline-block" sx={{ verticalAlign: 'middle' }}>
        {playlist.name}
      </Typography>
      <Typography variant="caption" display="inline-block" pl={1} sx={{ verticalAlign: 'middle' }}>
        {`[${(currentlyPlaying ?? 0) + 1}/${playlist.videos.length}]`}
      </Typography>
      {(showPlayAllButton ?? true) && (
        <LinkButton
          to={videoUrl(playlist.videos[0]) + playlistParams(playlist, 0)}
          text="Přehrát vše"
          icon={<PlayArrowIcon />}
        />
      )}
      {editable && /* userPlaylistInfo?.editable ?? */ false && (
        <LinkButton to={`${Route.playlist}/123`} text="Upravit" icon={<EditIcon />} />
      )}
      <Typography variant="body2" pt={1}>
        {playlist.description}
      </Typography>
      <VideoInlineList
        videos={playlist.videos}
        currentlyPlaying={currentlyPlaying}
        urlParamsGenerator={(_, index) => playlistParams(playlist, index)}
      />
    </Box>
  ) : (
    <></>
  );
}
