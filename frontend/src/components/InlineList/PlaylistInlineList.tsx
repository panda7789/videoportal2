import React, { useCallback, useEffect, useState } from 'react';
import { getUserPlaylistInfo, PlaylistModel, UserPlaylistInfo } from 'model/Playlist';
import { PlaylistCard } from 'components/Thumbnail/PlaylistCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Typography, Button, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { InlineList } from './InlineList';
import { VideoInlineList } from './VideoInlineList';
import { LinkButton } from 'components/Buttons/LinkButton';
import { Video } from 'model/Video';

export interface Props {
  playlists: PlaylistModel[];
}

export function PlaylistInlineList({ playlists }: Props) {
  return (
    <InlineList>
      {playlists.map((_playlist) => (
        <PlaylistCard key={_playlist.id} playlist={{ ..._playlist }} smallThumbnail />
      ))}
    </InlineList>
  );
}

export interface ExtendedProps {
  playlist: PlaylistModel;
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
  const [userPlaylistInfo, setUserPlaylistInfo] = useState<UserPlaylistInfo>();

  useEffect(() => {
    (async () => {
      setUserPlaylistInfo(await getUserPlaylistInfo(playlist.id));
    })();
  }, [editable, playlist]);

  const playlistUrlGenerator = useCallback((video: Video, index: number) => {
    return `?playlist=${playlist.id}&index=${index}`;
  }, []);

  return (
    <Box>
      <Typography variant="h6" display="inline-block" sx={{ verticalAlign: 'middle' }}>
        {playlist.name}
      </Typography>
      <Typography variant="caption" display="inline-block" pl={1} sx={{ verticalAlign: 'middle' }}>
        {`[${(currentlyPlaying ?? 0) + 1}/${playlist.videos.length}]`}
      </Typography>
      {(showPlayAllButton ?? true) && (
        <LinkButton to="/playlist/123" text="Přehrát vše" icon={<PlayArrowIcon />} />
      )}
      {editable && (userPlaylistInfo?.editable ?? false) && (
        <LinkButton to="/playlist/123" text="Upravit" icon={<EditIcon />} />
      )}
      <Typography variant="body2" pt={1}>
        {playlist.description}
      </Typography>
      <VideoInlineList
        videos={playlist.videos}
        currentlyPlaying={currentlyPlaying}
        urlGenerator={playlistUrlGenerator}
      />
    </Box>
  );
}
