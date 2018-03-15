import { when } from 'cerebral/operators';
import { state } from 'cerebral/tags';

export const isCurrentEditor = when(
  state`live.roomInfo.editorUserId`,
  state`user.id`,
  (editorId, currentUserId) => editorId === currentUserId
);
