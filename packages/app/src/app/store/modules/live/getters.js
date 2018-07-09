import { getParent } from 'mobx-state-tree';

export function isCurrentEditor() {
  const user = getParent(this).user;

  return user && this.isEditor(user.id);
}

export function isOwner() {
  const user = getParent(this).user;

  return this.isLive && user && this.roomInfo.ownerIds.indexOf(user.id) > -1;
}

export function isSourceOfTruth() {
  return this.roomInfo && this.roomInfo.sourceOfTruthDeviceId === this.deviceId;
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
