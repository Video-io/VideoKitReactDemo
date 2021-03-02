export interface StoriesUser {
  name: string
  avatar: string
}

export interface StoriesGroup {
  user: StoriesUser
  videoIds: string[]
}
