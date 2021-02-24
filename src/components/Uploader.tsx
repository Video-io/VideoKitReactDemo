import { useEffect, useRef, useState } from 'react';
import {
  Video,
  Uploader as VKUploader
} from '@video-io/videokit'
import Player from './Player'

function Uploader() {
  const [video, setVideo] = useState<Video>()
  const uploaderRef = useRef<HTMLDivElement>(null)

  useEffect(function() {
    const uploader = new VKUploader(uploaderRef.current!, {
      tags: ['test'],
      metadata: {
        'key1': 'value1'
      },
      title: 'Test video'
    })

    uploader.subscribe('uploadStarted', () => {
      setVideo(undefined)
    })

    uploader.subscribe('uploadCompleted', (event, upload) => {
      setVideo(upload.video)
      uploader.resetUpload()
    })

    return () => {
      uploader.destroy()
    };
  }, [])

  return (
    <>
      <div className="uploader" ref={uploaderRef} />
      {video ? (
        <Player video={video} />
      ) : null}
    </>
  )
}

export default Uploader;
