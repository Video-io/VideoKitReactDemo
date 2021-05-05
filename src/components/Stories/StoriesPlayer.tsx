import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import classNames from 'classnames'
import { Player, Playlist, AspectMode } from '@video-io/videokit'
import { StoriesGroup } from './Stories.types'

interface StoriesPlayerProps {
  isActive: boolean
  hide: () => void
  storyGroups: StoriesGroup[]
  currentGroupIndex: number
  currentStoryIndex: number,
  playStory: (groupIndex: number, storyIndex: number) => void
}

export default function StoriesPlayer({
  isActive,
  hide,
  storyGroups,
  currentGroupIndex,
  currentStoryIndex,
  playStory
}: StoriesPlayerProps) {
  // Create playlist with video ids from story groups
  const playlist = useMemo<Playlist>(() => new Playlist({
    videoIds: Array.prototype.concat.apply([], storyGroups.map(g => g.videoIds))
  }), [storyGroups])
  const playerRef = useRef<Player>()
  const playerElRef = useRef<HTMLDivElement>(null)
  const [playerWidth, setPlayerWidth] = useState<number>()
  const [playbackProgress, setPlaybackProgress] = useState<number>(0)
  const [playbackEnded, setPlaybackEnded] = useState<boolean>(false)
  const [hasNext, setHasNext] = useState<boolean>(false)
  const [hasPrev, setHasPrev] = useState<boolean>(false)
  const currentGroup = storyGroups[currentGroupIndex]
  const currentUser = currentGroup.user

  // Go to next/prev story
  const goToStory = useCallback((direction: number) => {
    const currentGroup = storyGroups[currentGroupIndex]
    let nextGroupIndex = currentGroupIndex
    let nextStoryIndex = currentStoryIndex + direction

    if (nextStoryIndex < 0) {
      if (nextGroupIndex > 0) {
        nextGroupIndex -= 1
        nextStoryIndex = 0
      } else {
        return
      }
    } else if (nextStoryIndex >= currentGroup.videoIds.length) {
      if (nextGroupIndex < storyGroups.length - 1) {
        nextGroupIndex += 1
        nextStoryIndex = 0
      } else {
        return
      }
    }

    setPlaybackProgress(0)
    playStory(nextGroupIndex, nextStoryIndex)
  }, [currentGroupIndex, currentStoryIndex, storyGroups, playStory])

  // Create player and subscribe on progress and ended events
  useEffect(() => {
    if (!playlist) return

    playerRef.current = new Player(playerElRef.current!, {
      playlist,
      autoplay: true,
      volume: 1,
      size: 'parent',
      aspectMode: AspectMode.RESIZE_ASPECT,
      showControls: false
    })
    playerRef.current.subscribe('timeupdate', (event, { currentTime }) => {
      const { duration } = playerRef.current!

      setPlaybackProgress(duration ? currentTime / duration : 0)
    })
    playerRef.current.subscribe('ended', () => setPlaybackEnded(true))

    return () => playerRef.current && playerRef.current.destroy()
  }, [playlist])

  // Track current story
  useEffect(() => {
    const player = playerRef.current
    const currentGroup = storyGroups[currentGroupIndex]
    const videoIndex = storyGroups.reduce((sum, { videoIds }, index) => {
      return sum + (index < currentGroupIndex ? videoIds.length : 0)
    }, currentStoryIndex)

    // Update navigation
    setHasPrev(videoIndex > 0)
    setHasNext(
      currentGroupIndex < storyGroups.length - 1 ||
      currentStoryIndex < currentGroup.videoIds.length - 1
    )
    setPlaybackProgress(0)

    // Play current story
    if (player) {
      setPlaybackEnded(false)
      player.setPlaylistIndex(videoIndex)
      player.play()
    }

  }, [currentGroupIndex, currentStoryIndex, storyGroups])

  // Toggle playback on toggle of stories player
  useEffect(() => {
    setPlaybackProgress(0)
    playerRef.current && playerRef.current[isActive ? 'play' : 'pause']()
  }, [isActive])

  // Update player width on container resize
  useEffect(() => {
    const playerEl = playerElRef.current

    if (!playerEl) return () => {}

    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect) {
        setPlayerWidth(entry.contentRect.height * 9 / 16)
      }
    })

    observer.observe(playerEl)

    return () => observer.unobserve(playerEl)
  }, [])

  // Handle playback was ended event and go to next story
  useEffect(() => {
    if (playbackEnded) {
      setPlaybackEnded(false)
      goToStory(1)
    }
  }, [playbackEnded, goToStory])

  return (
    <div className={`stories-player${isActive ? ' stories-player--active' : ''}`}>
      <div className="stories-player-bg" onClick={hide}></div>
      <div className="stories-player-close" onClick={hide}></div>
      {hasPrev ? (
        <div
          className="stories-player-arrow stories-player-arrow--prev"
          onClick={() => goToStory(-1)}></div>
      ) : null}
      {hasNext ? (
        <div
          className="stories-player-arrow stories-player-arrow--next"
          onClick={() => goToStory(1)}></div>
      ) : null}
      <div className="stories-player-body" style={playerWidth ? { width: playerWidth } : {}}>
        {currentUser ? (
          <div className="stories-player-user">
            <img
              className="stories-player-user-pic"
              src={currentUser.avatar}
              alt={currentUser.name} />
            <div className="stories-player-user-name">{currentUser.name}</div>
          </div>
        ) : null}
        <div className="stories-player-control">
          {currentGroup.videoIds.map((videoId, index) => (
            <div
              key={videoId}
              onClick={() => playStory(currentGroupIndex, index)}
              className={classNames('stories-player-control-item', {
                'stories-player-control-item--active': currentStoryIndex === index,
                'stories-player-control-item--played': index < currentStoryIndex
                })}>
              <div style={currentStoryIndex === index ? { width: `${playbackProgress * 100}%`} : {}} />
            </div>
          ))}
        </div>
        <div className="stories-player-video" ref={playerElRef}></div>
      </div>
    </div>
  )
}
