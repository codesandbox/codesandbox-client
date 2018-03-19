import { getParent } from 'mobx-state-tree';

export function isCurrentEditor() {
  const user = getParent(this).user;

  return (
    user &&
    this.isLive &&
    (this.roomInfo.mode === 'open' ||
      this.isOwner ||
      (user && this.roomInfo.editorIds.indexOf(user.id) > 0))
  );
}

export function liveUsersByModule() {
  const usersByModule = {};

  if (!this.isLive || !this.roomInfo) {
    return {};
  }

  const currentUser = getParent(this).user.id;

  this.roomInfo.usersMetadata.forEach((user, userId) => {
    if (currentUser && userId !== currentUser.id) {
      usersByModule[user.currentModuleShortid] =
        usersByModule[user.currentModuleShortid] || [];
      usersByModule[user.currentModuleShortid].push(user.color);
    }
  });

  return usersByModule;
}
