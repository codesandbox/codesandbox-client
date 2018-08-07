import track from 'common/utils/analytics';

export function saveAllModules(store, signals) {
  const sandbox = store.editor.currentSandbox;

  // In case you don't own the sandbox we cannot do >1 calls for saving module as you would then
  // also fork >1 times. The reason that we want to save seperately is because we want to have
  // fine-grained control of which saves succeed and which saves fail
  if (sandbox.owned) {
    track('Save All Modified Modules');
    sandbox.modules
      .filter(m => !store.editor.isModuleSynced(m.shortid))
      .forEach(module => {
        signals.editor.codeSaved({
          code: module.code,
          moduleShortid: module.shortid,
        });
      });
  } else {
    signals.editor.saveClicked();
  }
}
