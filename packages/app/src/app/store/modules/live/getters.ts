import { State } from './types';

export function isEditor(state: State) {
  const { isLive, roomInfo } = state;
  const isOpen = roomInfo.mode === 'open';
  const allEditorIds = [roomInfo.ownerId].concat(roomInfo.editorIds);

  return userId => isLive && (isOpen || allEditorIds.indexOf(userId) >= 0);
}
