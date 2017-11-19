// @flow

export const RENAME_MODULE = 'RENAME_MODULE';
export const MOVE_MODULE = 'MOVE_MODULE';
export const SET_CODE = 'SET_CODE';
export const SET_MODULE_SYNCED = 'SET_MODULE_SYNCED';
export const SET_MODULE_ERROR = 'SET_MODULE_ERROR';
export const CLEAR_MODULE_ERRORS = 'CLEAR_MODULE_ERRORS';

export const ADD_MODULE_CORRECTION = 'ADD_MODULE_CORRECTION';

export default {
  renameModule: (id: string, title: string) => ({
    type: RENAME_MODULE,
    id,
    title,
  }),
  moveModule: (id: string, directoryShortid: string) => ({
    type: MOVE_MODULE,
    id,
    directoryShortid,
  }),
  setCode: (id: string, code: string, isNotSynced: boolean = true) => ({
    type: SET_CODE,
    id,
    code,
    isNotSynced,
  }),
  setModuleSynced: (id: string) => ({
    type: SET_MODULE_SYNCED,
    id,
  }),
  clearErrors: () => ({
    type: CLEAR_MODULE_ERRORS,
  }),
  setError: (
    id: string,
    {
      title,
      message,
      line,
      column,
    }: { title: string, message: string, line: ?number, column: ?number }
  ) => ({
    id,
    type: SET_MODULE_ERROR,
    error: {
      title,
      message,
      line,
      column,
    },
  }),

  addCorrection: (
    id: string,
    {
      message,
      line,
      column,
      severity,
      source,
    }: {
      message: string,
      line: number,
      column: number,
      severity: 'warning' | 'notice',
      source: ?string,
    }
  ) => ({
    id,
    type: ADD_MODULE_CORRECTION,
    correction: {
      message,
      line,
      column,
      severity,
      source,
    },
  }),
};
