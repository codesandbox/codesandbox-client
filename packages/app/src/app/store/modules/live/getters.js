import { getParent } from 'mobx-state-tree';

export function isCurrentEditor() {
  const user = getParent(this).user;

  return user && this.isEditor(user.id);
}

export function isOwner() {
  const user = getParent(this).user;

  // We only mark the first owner as the 'real' owner. This owner is responsible
  // for syncing state with everyone. When this owner leaves the second owner
  // will become the first one and take over the responsibility of syncing.
  return this.isLive && this.roomInfo.ownerIds.indexOf(user.id) > -1;
}

export function liveUsersByModule() {
  const usersByModule = {};

  if (!this.isLive || !this.roomInfo) {
    return {};
  }

  const currentUser = getParent(this).user;

  if (!currentUser) {
    return {};
  }

  this.roomInfo.usersMetadata.forEach((user, userId) => {
    if (currentUser && userId !== currentUser.id) {
      usersByModule[user.currentModuleShortid] =
        usersByModule[user.currentModuleShortid] || [];
      usersByModule[user.currentModuleShortid].push(user.color);
    }
  });

  return usersByModule;
}
