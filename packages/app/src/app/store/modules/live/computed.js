export function isEditor(state, rootState) {
  return (
    state.isLive &&
    (state.roomInfo.mode === 'open' ||
      state.roomInfo.ownerId === rootState.user.id ||
      state.roomInfo.editorIds.indexOf(rootState.user.id) > 0)
  );
}

export function isCurrentEditor(state, rootState) {
  const user = rootState.user;

  return user && state.isEditor.get();
}

export function liveUsersByModule(state, rootState) {
  const usersByModule = {};

  if (!state.isLive || !state.roomInfo) {
    return {};
  }

  const currentUser = rootState.user;

  if (!currentUser) {
    return {};
  }

  state.roomInfo.usersMetadata.forEach((user, userId) => {
    if (currentUser && userId !== currentUser.id) {
      usersByModule[user.currentModuleShortid] =
        usersByModule[user.currentModuleShortid] || [];
      usersByModule[user.currentModuleShortid].push(user.color);
    }
  });

  return usersByModule;
}
