import { State as RootState } from 'app/fluent';
import { State } from './types';

export function isCurrentEditor(state: State, rootState: RootState) {
  const { user } = rootState;

  return user && state.isEditor(user.id);
}

export function liveUsersByModule(state: State, rootState: RootState) {
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
