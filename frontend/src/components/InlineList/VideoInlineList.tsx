import React from 'react';
import VideoCard from 'components/Thumbnail/VideoCard';
import { Video } from 'model/Video';
import { InlineList } from './InlineList';

export interface Props {
  videos: Video[];
}
export function VideoInlineList({ videos }: Props) {
  return (
    <InlineList>
      {videos.map((_video) => (
        <VideoCard
          key={_video.id}
          video={{ ..._video }}
          showChannel={false}
          showDescription={false}
          smallThumbnail
        />
      ))}
    </InlineList>
  );
}
