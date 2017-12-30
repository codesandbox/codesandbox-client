import { sequence } from 'cerebral';

export function addTabById(id) {
  return function addTabById({ state, resolve }) {
    // eslint-disable-line
    const modules = state.get('editor.currentSandbox.modules');
    const shortid = modules.find(module => module.id === resolve.value(id))
      .shortid;

    const newTab = {
      type: 'MODULE',
      moduleShortid: shortid,
      dirty: true,
    };
    const tabs = state.get('editor.tabs');

    if (tabs.length === 0) {
      state.push('editor.tabs', newTab);
    } else if (!tabs.some(tab => tab.moduleShortid === shortid)) {
      const dirtyTabIndex = tabs.findIndex(tab => tab.dirty);

      if (dirtyTabIndex >= 0) {
        state.splice('editor.tabs', dirtyTabIndex, 1, newTab);
      } else {
        state.splice('editor.tabs', 0, 0, newTab);
      }
    }
  };
}

export function setCurrentModuleById(id) {
  return function setCurrentModuleById({ state, resolve }) {
    // eslint-disable-line
    const sandbox = state.get('editor.currentSandbox');
    const module = sandbox.modules.find(
      moduleEntry => moduleEntry.id === resolve.value(id)
    );

    state.set('editor.currentModuleShortid', module.shortid);
  };
}

export function setCurrentModule(id) {
  return sequence('setCurrentModule', [
    addTabById(id),
    setCurrentModuleById(id),
  ]);
}
