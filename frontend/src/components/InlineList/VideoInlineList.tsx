import React from 'react';
import VideoCard from 'components/Thumbnail/VideoCard';
import { Video } from 'model/Video';
import { Skeleton } from '@mui/material';
import { InlineList } from 'components/InlineList/InlineList';

export interface Props {
  videos?: Video[];
  skeletonCount?: number;
  currentlyPlaying?: number;
  urlParamsGenerator?: (video: Video, index: number) => string;
  showChannel?: boolean;
  showDescription?: boolean;
}
export function VideoInlineList({
  videos,
  currentlyPlaying,
  urlParamsGenerator,
  skeletonCount = 5,
  showChannel = false,
  showDescription = false,
}: Props) {
  return (
    <InlineList>
      {videos
        ? videos.map((_video, index) => (
            <VideoCard
              key={_video.id}
              video={_video}
              showChannel={showChannel}
              showDescription={showDescription}
              smallThumbnail
              currentlyPlaying={currentlyPlaying === index}
              urlParams={urlParamsGenerator ? urlParamsGenerator(_video, index) : ''}
            />
          ))
        : [...Array(skeletonCount)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton key={`skeleton-${i}`} variant="rounded" animation="wave" height={220} />
          ))}
    </InlineList>
  );
}
