import React from 'react';
import VideoCard from "components/Thumbnail/VideoCard";
import { VideoThumbnail } from "model/Video";
import { InlineList } from "./InlineList";

export interface Props {
  videos: VideoThumbnail[];
}
export function VideoInlineList({ videos }: Props) {
  return (
    <InlineList>
      {
        videos.map((_video) => (
          <VideoCard key={_video.id} video={{ ..._video }} showAvatar={false} showDescription={false} smallThumbnail />
        ))
      }
    </InlineList>
    );
}