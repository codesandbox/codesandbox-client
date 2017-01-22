export const SET_TAB = 'SET_TAB';
export const CLOSE_TAB = 'CLOSE_TAB';
export const OPEN_MODULE_TAB = 'OPEN_MODULE_TAB';
export const RESET_SANDBOX_VIEW = 'RESET_SANDBOX_VIEW';
export const SET_CURRENT_SANDBOX = 'SET_CURRENT_SANDBOX';

export default {
  openModuleTab: id => ({
    type: OPEN_MODULE_TAB,
    moduleId: id,
    view: 'EditorPreview',
  }),
  setTab: id => ({ type: SET_TAB, id }),
  closeTab: id => ({ type: CLOSE_TAB, id }),
  reset: () => ({ type: RESET_SANDBOX_VIEW }),
  setCurrentSandbox: sandboxId => ({ type: SET_CURRENT_SANDBOX, sandboxId }),
};
