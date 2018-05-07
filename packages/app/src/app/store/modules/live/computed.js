export function isEditor(userId) {
  return (
    this.isLive &&
    (this.roomInfo.mode === 'open' ||
      this.roomInfo.ownerId === userId ||
      this.roomInfo.editorIds.indexOf(userId) > 0)
  );
}
