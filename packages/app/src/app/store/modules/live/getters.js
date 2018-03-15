import { getParent } from 'mobx-state-tree';

export function isCurrentEditor() {
  const user = getParent(this).user;

  return user && this.isLive && this.roomInfo.editorUserId === user.id;
}
