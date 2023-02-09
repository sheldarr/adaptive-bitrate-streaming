import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";

import "video.js/dist/video-js.css";

const VIDEO_JS_OPTIONS = {
  autoplay: true,
  controls: true,
  responsive: true,
  fluid: true,
  sources: [
    {
      src: `${process.env.PUBLIC_URL}/assets/4k-example.m3u8`,
      type: "application/x-mpegURL",
    },
  ],
};

export const VideoJS = () => {
  const [initialized, setInitialized] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!initialized && !!videoRef.current) {
      const player = videojs(videoRef.current, VIDEO_JS_OPTIONS, () => {
        videojs.log("player is ready");
      });

      setInitialized(true);
      setPlayer(player);
    }
  }, [initialized, videoRef]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // @ts-ignore
      const qualityLevels = player?.qualityLevels();

      console.log(qualityLevels);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [player]);

  React.useEffect(() => {
    return () => {
      if (player) {
        player.dispose();
      }
    };
  });

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-playcentered" />
    </div>
  );
};

export default VideoJS;
