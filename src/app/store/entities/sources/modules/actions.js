// @flow

export const CHANGE_CODE = 'CHANGE_CODE';
export const RENAME_MODULE = 'RENAME_MODULE';
export const MOVE_MODULE = 'MOVE_MODULE';

export default {
  changeCode: (id: string, code: string) => ({
    type: CHANGE_CODE,
    id,
    code,
  }),
  renameModule: (id: string, title: string) => ({
    type: RENAME_MODULE,
    id,
    title,
  }),
  moveModule: (id: string, directoryId: string) => ({
    type: MOVE_MODULE,
    id,
    directoryId,
  }),
};
