// @flow

import { singleModuleSelector, modulesFromSandboxSelector } from './selectors';
import { preferencesSelector } from '../../../preferences/selectors';
import { sandboxesSelector } from '../selectors';
import notificationActions from '../../../notifications/actions';

import prettify from './utils/prettify';

export const RENAME_MODULE = 'RENAME_MODULE';
export const MOVE_MODULE = 'MOVE_MODULE';
export const PRETTIFY_MODULE = 'PRETTIFY_MODULE';
export const SET_CODE = 'SET_CODE';
export const SET_MODULE_SYNCED = 'SET_MODULE_SYNCED';
export const SET_MODULE_ERROR = 'SET_MODULE_ERROR';
export const CLEAR_MODULE_ERRORS = 'CLEAR_MODULE_ERRORS';

export const ADD_MODULE_CORRECTION = 'ADD_MODULE_CORRECTION';

const setModuleSynced = (id: string, synced: boolean = true) => ({
  type: SET_MODULE_SYNCED,
  id,
  synced,
});

const setCode = (id: string, code: string, isNotSynced: boolean = true) => (
  dispatch: Function
) => {
  dispatch({
    type: SET_CODE,
    id,
    code,
    isNotSynced,
  });
  dispatch(setModuleSynced(id, !isNotSynced));
};

const getPrettierConfigForModule = (
  id: string,
  dispatch: Function,
  state: Object
) => {
  const sandboxes = sandboxesSelector(state);
  const sandboxOfModule = Object.values(sandboxes).find(s =>
    s.modules.includes(id)
  );
  if (!sandboxOfModule) return null;

  const modules = modulesFromSandboxSelector(state, {
    sandbox: sandboxOfModule,
  });
  const prettierRcModule = modules.find(
    m => m.directoryShortid == null && m.title === '.prettierrc'
  );
  if (!prettierRcModule) return null;

  // if we have found a config file, we try to parse it
  try {
    return JSON.parse(prettierRcModule.code);
  } catch (e) {
    dispatch(
      notificationActions.addNotification(
        'Your .prettierrc is not a valid JSON file',
        'error'
      )
    );
  }
  return null;
};

const prettifyModule = (id: string) => async (dispatch, getState: Function) => {
  const module = singleModuleSelector(getState(), { id });
  const preferences = preferencesSelector(getState());
  const prettierRcConfig = getPrettierConfigForModule(id, dispatch, getState());

  dispatch({
    type: PRETTIFY_MODULE,
    id,
  });

  try {
    const newCode = await prettify(
      module.title,
      module.code,
      prettierRcConfig || preferences.prettierConfig
    );

    dispatch(setCode(id, newCode));
    return newCode;
  } catch (e) {
    console.error(e);
    return module.code;
  }
};

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
  setCode,
  setModuleSynced,
  prettifyModule,
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
