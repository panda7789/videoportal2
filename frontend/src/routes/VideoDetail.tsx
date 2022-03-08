/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';

const VideoDetail = () => {
  const videoSrc = '/sampleVideo.mp4';
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let player: VideoJsPlayer;
    if (playerRef.current) {
      player = videojs(
        playerRef.current,
        { autoplay: true, muted: false, controls: true, fluid: true },
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
    <div data-vjs-player>
      <video ref={playerRef} className="video-js vjs-16-9" playsInline />
    </div>
  );
};

export default VideoDetail;
