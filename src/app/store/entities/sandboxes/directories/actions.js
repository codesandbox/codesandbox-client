// @flow

export const RENAME_DIRECTORY = 'RENAME_DIRECTORY';
export const MOVE_DIRECTORY = 'MOVE_DIRECTORY';

export default {
  renameDirectory: (id: string, title: string) => ({
    type: RENAME_DIRECTORY,
    id,
    title,
  }),
  moveDirectory: (id: string, directoryShortid: string) => ({
    type: MOVE_DIRECTORY,
    id,
    directoryShortid,
  }),
};
