export function isEditor(liveUserId) {
  return (
    this.isLive &&
    (this.roomInfo.mode === 'open' ||
      this.roomInfo.ownerIds.indexOf(liveUserId) > -1 ||
      this.roomInfo.editorIds.indexOf(liveUserId) > -1)
  );
}
