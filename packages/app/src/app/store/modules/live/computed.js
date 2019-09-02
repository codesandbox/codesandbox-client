export function isEditor(liveUserId) {
  return (
    this.isLive &&
    (this.roomInfo.mode === 'open' ||
      this.roomInfo.ownerIds.includes(liveUserId) ||
      this.roomInfo.editorIds.includes(liveUserId))
  );
}
