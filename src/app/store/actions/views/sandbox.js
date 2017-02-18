import { currentSandboxIdSelector } from '../../selectors/views/sandbox-selector';
import { defaultModuleSelector } from '../../entities/modules/selector';

export const SET_TAB = 'SET_TAB';
export const CLOSE_TAB = 'CLOSE_TAB';
export const OPEN_MODULE_TAB = 'OPEN_MODULE_TAB';
export const RESET_SANDBOX_VIEW = 'RESET_SANDBOX_VIEW';
export const SET_CURRENT_SANDBOX = 'SET_CURRENT_SANDBOX';

const openModuleTab = id => ({
  type: OPEN_MODULE_TAB,
  moduleId: id,
  view: 'EditorPreview',
});

export default {
  openModuleTab,
  openDefaultModuleTab: () => (dispatch, getState) => {
    const sandboxId = currentSandboxIdSelector(getState());
    const defaultModule = defaultModuleSelector(getState(), { sandboxId });
    if (defaultModule) {
      dispatch(openModuleTab(defaultModule.id));
    }
  },
  setTab: id => ({ type: SET_TAB, id }),
  reset: () => ({ type: RESET_SANDBOX_VIEW }),
  setCurrentSandbox: sandboxId => ({ type: SET_CURRENT_SANDBOX, sandboxId }),
};
