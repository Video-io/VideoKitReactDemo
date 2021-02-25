import { useEffect, useCallback, useState, useMemo } from 'react';
import { Video, Playlist, VideoLoader } from '@video-io/videokit'

/**
 * Hook takes video playlist and performs video preloading, caching and pagination
 * @param playlist Video playlist
 */
export function useVideoLoader(playlist?: Playlist): [Video[], (index: number) => void] {
  const [videos, setVideos] = useState<Video[]>([])
  // Handler function for video updates
  const updateVideos = useCallback(() => setVideos(playlist!.videos), [playlist])
  // Create video loader instance to preload videos from playlist
  const loader = useMemo(() => new VideoLoader(), [])

  // Set current playlist videos and subscribe on videos update
  useEffect(() => {
    if (!playlist) return

    setVideos(playlist.videos)
    playlist.subscribe('videosUpdated', updateVideos)
    loader.setPlaylist(playlist)

    return () => {
      loader.destroy()
      playlist.unsubscribe('videosUpdated', updateVideos)
    }
  }, [playlist, updateVideos, loader])

  function setCurrentIndex(index: number) {
    // Preload next page of video if there are less than 5 videos left in the playlist
    if (videos.length - 5 < index) {
      playlist!.loadMoreVideos()
    }

    // Set current video index to the loader to adjust preloading queue
    loader.setPlaylistIndex(index)
  }

  return [videos, setCurrentIndex]
}