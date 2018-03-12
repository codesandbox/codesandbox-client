import { State as RootState } from 'fluent'
import { State } from './types'

export function isProfileCurrentUser(state: State, root: RootState) {
  return root.user && root.user.id === state.currentProfileId;
}

export function showcasedSandbox(state: State, root: RootState) {
  return (
    state.current.showcasedSandboxShortid &&
    root.editor.sandboxes.get(state.current.showcasedSandboxShortid)
  );
}
