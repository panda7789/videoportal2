import React from 'react';
import VideoCard from 'components/Thumbnail/VideoCard';
import { Video } from 'model/Video';
import { InlineList } from './InlineList';

export interface Props {
  videos: Video[];
  currentlyPlaying?: number;
  urlParamsGenerator?: (video: Video, index: number) => string;
}
export function VideoInlineList({ videos, currentlyPlaying, urlParamsGenerator }: Props) {
  return (
    <InlineList>
      {videos.map((_video, index) => (
        <VideoCard
          key={_video.id}
          video={{ ..._video }}
          showChannel={false}
          showDescription={false}
          smallThumbnail
          currentlyPlaying={currentlyPlaying === index}
          urlParams={urlParamsGenerator ? urlParamsGenerator(_video, index) : ''}
        />
      ))}
    </InlineList>
  );
}
