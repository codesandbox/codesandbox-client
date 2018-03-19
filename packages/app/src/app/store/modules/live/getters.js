import { getParent } from 'mobx-state-tree';

export function isCurrentEditor() {
  const user = getParent(this).user;

  return (
    user &&
    this.isLive &&
    (this.roomInfo.mode === 'open' || this.roomInfo.editorUserId === user.id)
  );
}

export function liveUsersByModule() {
  const usersByModule = {};

  if (!this.isLive || !this.roomInfo) {
    return {};
  }

  this.roomInfo.usersMetadata.forEach((user, userId) => {
    if (userId !== getParent(this).user.id) {
      usersByModule[user.currentModuleShortid] =
        usersByModule[user.currentModuleShortid] || [];
      usersByModule[user.currentModuleShortid].push(user.color);
    }
  });

  return usersByModule;
}
