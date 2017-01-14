export const SET_TAB = 'SET_TAB';
export const CLOSE_TAB = 'CLOSE_TAB';
export const OPEN_MODULE_TAB = 'OPEN_MODULE_TAB';

export default {
  openModuleTab: id => ({
    type: OPEN_MODULE_TAB,
    moduleId: id,
    view: 'EditorPreview',
  }),
  setTab: id => ({ type: SET_TAB, id }),
  closeTab: id => ({ type: CLOSE_TAB, id }),
};
