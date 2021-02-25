import { useEffect, useRef } from 'react';
import { Video, Player, Playlist } from '@video-io/videokit'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useVideoLoader } from '../hooks'

interface FeedProps {
  playlist?: Playlist
}

function Feed({ playlist }: FeedProps) {
  let [videos, setCurrentIndex] = useVideoLoader(playlist)

  return (
    <div className="feed">
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            onItemsRendered={({ visibleStopIndex }) => setCurrentIndex(visibleStopIndex)}
            itemCount={videos.length}
            itemSize={500}>
              {({ index, style }) => (
                <div style={style}>
                  <FeedPlayer video={videos[index]} />
                </div>
              )}
          </List>
        )}
      </AutoSizer>
    </div>
  )
}

function FeedPlayer({ video }: { video: Video }) {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(function() {
    const player = new Player(playerRef.current!, {
      video,
      autoPlay: false,
      playOnFocus: true,
      loop: true,
      volume: 1,
      size: 'parent',
      showControls: false
    })

    return () => player.destroy()
  }, [video])

  return (
    <div className="feed-player" ref={playerRef}></div>
  )
}

export default Feed;
