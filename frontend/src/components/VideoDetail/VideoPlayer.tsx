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
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.className = 'video-js vjs-16-9 vjs-big-play-centered';
      videoRef.current?.appendChild(videoElement);

      const player = videojs(
        videoElement,
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
      playerRef.current = player;
    } else {
      // const player = playerRef.current;
      // player.autoplay(options.autoplay);
      // player.src(options.sources);
    }
  }, [videoRef]);

  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return <div ref={videoRef} style={{ height: '100vh - 64px' }} />;
}
