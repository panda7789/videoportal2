import React from 'react';
import { Playlist } from 'model/Playlist';
import { PlaylistCard } from 'components/Thumbnail/PlaylistCard';
import { InlineList } from "./InlineList";

export interface Props {
  playlists: Playlist[];
}

export function PlaylistInlineList({ playlists }: Props) {
  return (
    <InlineList>
      {
        playlists.map((_playlist) => (
          <PlaylistCard key={_playlist.id} playlist={{ ..._playlist }} smallThumbnail />
          ))
      }
    </InlineList>
    );
}