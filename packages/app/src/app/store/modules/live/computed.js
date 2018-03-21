import { getParent } from 'mobx-state-tree';

export function isEditor(userId) {
  const sandbox = getParent(this).editor.currentSandbox;

  return (
    this.isLive &&
    (this.roomInfo.mode === 'open' ||
      sandbox.author.id === userId ||
      this.roomInfo.editorIds.indexOf(userId) > 0)
  );
}
