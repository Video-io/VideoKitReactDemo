import { useEffect, useRef } from 'react';
import { Player, VideoQuality } from '@video-io/videokit'
import { StoriesGroup } from './Stories.types'

interface StoriesListProps {
  stories: StoriesGroup[]
  playStory: (groupIndex: number) => void
}

export default function StoriesList({ stories, playStory }: StoriesListProps) {
  return (
    <div className="stories-list">
      {stories.map((group, index) => (
        <div className="story" key={index} onClick={() => playStory(index)}>
          <StoryPreview videoId={group.videoIds[0]} />
          <img
            className="story-avatar"
            src={group.user.avatar}
            alt={group.user.name}/>
          <div className="story-username">{group.user.name}</div>
        </div>
      ))}
    </div>
  )
}

function StoryPreview({ videoId }: { videoId: string }) {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(function() {
    const player = new Player(playerRef.current!, {
      videoId,
      playbackQuality: VideoQuality.LOW,
      autoPlay: true,
      loop: true,
      volume: 0,
      size: 'parent',
      showControls: false
    })

    return () => player.destroy()
  }, [videoId])

  return (
    <div className="story-preview" ref={playerRef}></div>
  )
}
