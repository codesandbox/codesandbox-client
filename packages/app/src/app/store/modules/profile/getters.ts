import { State } from './types'

export function current(state: State) {
  return state.profiles.get(state.currentProfileId);
}

export function currentLikedSandboxes(state: State) {
  return state.likedSandboxes.get(state.current.username);
}

export function currentSandboxes(state: State) {
  return state.sandboxes.get(state.current.username);
}
