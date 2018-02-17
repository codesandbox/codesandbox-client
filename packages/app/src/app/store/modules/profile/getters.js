export function current(state) {
  return state.profiles.get(state.currentProfileId);
}

export function currentLikedSandboxes(state) {
  return state.likedSandboxes.get(state.current.username);
}

export function currentSandboxes(state) {
  return state.sandboxes.get(state.current.username);
}
