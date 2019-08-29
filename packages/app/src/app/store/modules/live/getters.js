export function isCurrentEditor() {
  return this.isEditor(this.liveUserId);
}

export function isOwner() {
  return this.isLive && this.roomInfo.ownerIds.includes(this.liveUserId);
}

export function liveUsersByModule() {
  const usersByModule = {};

  if (!this.isLive || !this.roomInfo) {
    return {};
  }

  const liveUserId = this.liveUserId;

  this.roomInfo.users.forEach(user => {
    const userId = user.id;
    if (userId !== liveUserId) {
      usersByModule[user.currentModuleShortid] =
        usersByModule[user.currentModuleShortid] || [];
      usersByModule[user.currentModuleShortid].push(user.color);
    }
  });

  return usersByModule;
}
