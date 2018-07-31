export function isEditor(userId) {
  return (
    this.isLive &&
    (this.roomInfo.mode === 'open' ||
      this.roomInfo.ownerIds.indexOf(userId) > -1 ||
      this.roomInfo.editorIds.indexOf(userId) > 0)
  );
}
