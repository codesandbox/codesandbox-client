import { Dictionary, ComputedValue } from '@cerebral/fluent'

type Git = {
  username: string
  repo: string
  path: string
  commitSha: string
  branch: string
}

export type Sandbox = {
  forkCount: number
  git: Git
  id: string
  insertedAt: string
  likeCount: number
  privacy: number
  template: string
  title: string
  updatedAt: string
  viewCount: number
}

type Badge = {
  visible: boolean
  name: string
  id: string
}

type Profile = {
  viewCount: number
  username: string
  subscriptionSince: string
  showcasedSandboxShortid: string
  sandboxcount: number
  receivedLikeCount: number
  name: string
  id: string
  givenLikeCount: number
  forkedCount: number
  badges: Badge[]
  avatarUrl: string
}

export type State = {
  profiles: Dictionary<Profile>
  currentProfileId: string
  notFound: boolean
  isLoadingProfile: boolean
  sandboxes: Dictionary<Dictionary<Sandbox[]>>
  likedSandboxes: Dictionary<Dictionary<Sandbox[]>>
  userSandboxes: Sandbox[]
  currentSandboxesPage: number
  currentLikedSandboxesPage: number
  isLoadingSandboxes: boolean
  sandboxToDeleteIndex: number
  isProfileCurrentUser: ComputedValue<boolean>
  showcasedSandbox: ComputedValue<Sandbox>
  current: Profile
  currentSandboxes: Dictionary<Sandbox[]>
  currentLikedSandboxes: Dictionary<Sandbox[]>
}
