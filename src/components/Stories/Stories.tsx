import { useState } from 'react';
import StoriesList from './StoriesList'
import StoriesPlayer from './StoriesPlayer'
import { StoriesGroup } from './Stories.types'
import './Stories.css'

const STORY_GROUPS: StoriesGroup[] = [{
  user: {
    name: 'Leo Gill',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  videoIds: [
    'a3065c58-013f-4526-8e69-d2b953f59fc2',
    '147b9251-3768-4a9f-a345-9dba9290f380',
    '6499e376-a359-4af6-862e-4595aefe16e0'
  ]
}, {
  user: {
    name: 'Lucrecia Calder',
    avatar: 'https://randomuser.me/api/portraits/women/95.jpg'
  },
  videoIds: [
    '8180d2cb-8185-47de-815f-87f65f3c0381',
    'd7ac6d42-88a7-4fa4-8346-2a4172f70477'
  ]
}, {
  user: {
    name: 'Mia Denys',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  videoIds: [
    '991bd41d-512d-40c2-8bdf-92be2313082f'
  ]
}, {
  user: {
    name: 'Wyatt Morris',
    avatar: 'https://randomuser.me/api/portraits/men/83.jpg'
  },
  videoIds: [
    'b0bf7cc4-4e27-47a6-bc2d-77d4a6097eaf',
    '3d28e8d6-bff7-44df-90d5-04e47ce2c525',
    '30536610-1dd2-49f7-b89d-a6dc3bf04f50'
  ]
}]

function Stories() {
  const [currentGroupIndex, setCurrentGroupIndex] = useState<number>(0)
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0)
  const [isPlayerActive, setPlayerActive] = useState<boolean>(false)
  const playStory = (groupIndex: number, storyIndex: number = 0) => {
    setCurrentGroupIndex(groupIndex)
    setCurrentStoryIndex(storyIndex)
    setPlayerActive(true)
  }

  return (
    <div className="stories">
      <StoriesList
        stories={STORY_GROUPS}
        playStory={playStory} />
      <StoriesPlayer
        isActive={isPlayerActive}
        hide={() => setPlayerActive(false)}
        storyGroups={STORY_GROUPS}
        currentGroupIndex={currentGroupIndex}
        currentStoryIndex={currentStoryIndex}
        playStory={playStory} />
    </div>
  )
}

export default Stories;
