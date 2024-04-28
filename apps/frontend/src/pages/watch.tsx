import { VStack } from '@kuma-ui/core';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export const WatchPage = () => {
  const videoId = new URLSearchParams(window.location.search).get('v');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    const playlistURL = `${import.meta.env.VITE_PREMIERE_PLAYLIST_URL}/${videoId}.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: true,
      });
      hls.loadSource(playlistURL);
      hls.attachMedia(videoRef.current);
      videoRef.current.play();
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = playlistURL;
      videoRef.current.play();
    }
  }, [videoId]);

  return (
    <VStack>
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        width={640}
        height={360}
      />
    </VStack>
  );
};
