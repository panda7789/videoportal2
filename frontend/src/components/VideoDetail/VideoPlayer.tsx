import { useUserVideoStatsGETQuery } from 'api/axios-client/Query';
import React, { useRef, useEffect, useContext, useState } from 'react';
import { UserContext } from 'routes/Root';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hotkeys';

export interface Props {
  videoSrc: string;
  watchedTimeSec?: number;
  autoplay?: boolean;
  muted?: boolean;
  triggerWatched?(sec: number): void;
}

export function VideoPlayer({ videoSrc, autoplay, muted, triggerWatched, watchedTimeSec }: Props) {
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const usercontext = useContext(UserContext);

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
              enableVolumeScroll: false,
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
    }
    const player = playerRef.current;
    let lastWatchedSec = 9;
    const timeCheck = () => {
      const currentTime = Math.round(player.currentTime());
      if (currentTime % 10 === 0 && currentTime > lastWatchedSec) {
        lastWatchedSec = currentTime;
        triggerWatched?.(currentTime);
      }
    };
    if (triggerWatched && usercontext?.user) {
      player.on('timeupdate', timeCheck);
    }
  }, [videoRef, usercontext]);

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  useEffect(() => {
    playerRef.current?.currentTime(watchedTimeSec ?? 0);
  }, [watchedTimeSec]);

  return <div ref={videoRef} style={{ height: '100vh - 64px' }} />;
}
