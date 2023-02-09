import React, { useRef, useEffect } from 'react';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';

export interface Props {
  videoSrc: string;
  autoplay?: boolean;
  muted?: boolean;
}

export function VideoPlayer({ videoSrc, autoplay, muted }: Props) {
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let player: VideoJsPlayer;
    if (playerRef.current) {
      player = videojs(
        playerRef.current,
        {
          autoplay: autoplay ?? false,
          muted: muted ?? false,
          controls: true,
          aspectRatio: '9:16',
          responsive: true,
          fluid: true,
          plugins: {
            hotkeys: {
              volumeStep: 0.1,
              seekStep: 5,
              enableModifiersForNumbers: false,
            },
          },
        },
        () => {
          player.src(videoSrc);
        },
      );
    }

    return () => {
      player.dispose();
    };
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={playerRef}
      className="video-js vjs-16-9 vjs-big-play-centered"
      height="calc(100vh - 64px)"
      width="100%"
    />
  );
}
