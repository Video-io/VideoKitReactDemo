import { useEffect, useRef } from 'react';
import {
  Player as VKPlayer,
  Video,
  Playlist,
  AspectMode,
} from '@video-io/videokit'

interface PlayerProps {
  video?: Video
  playlist?: Playlist
}

function Player({ video, playlist }: PlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(function() {
    const player = new VKPlayer(playerRef.current!, {
      video,
      playlist,
      autoplay: true,
      loop: true,
      aspectMode: AspectMode.RESIZE_ASPECT_FILL,
      volume: 0.5,
      size: 'parent',
      showControls: true
    })

    return () => {
      player.destroy();
    };
  }, [video, playlist])

  return (
    <div className="player" ref={playerRef} />
  )
}

export default Player;
