import ReactPlayer from "react-player/lazy";

import "./index.css";

export const ReactPlayerDemo = () => {
  return (
    <ReactPlayer
      className="react-player"
      url={`${process.env.PUBLIC_URL}/assets/4k-example.m3u8`}
      controls
      width="100vw"
      height="100vh"
      onReady={(player) => {
        const hlsPlayer = player.getInternalPlayer("hls");

        console.log(hlsPlayer.levels);
      }}
    />
  );
};

export default ReactPlayerDemo;
