export function isProfileCurrentUser(state, root) {
  return root.user && root.user.id === state.currentProfileId;
}

export function showcasedSandbox(state, root) {
  return (
    state.current.showcasedSandboxShortid &&
    root.editor.sandboxes.get(state.current.showcasedSandboxShortid)
  );
}
