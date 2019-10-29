import track from '@codesandbox/common/lib/utils/analytics';

export function saveAllModules(
  currentSandbox,
  changedModuleShortids,
  codeSaved,
  saveClicked
) {
  // const {
  //   state: {
  //     editor: { currentSandbox, changedModuleShortids },
  //   },
  //   actions: {
  //     editor: { codeSaved, saveClicked },
  //   }
  // } = useOvermind();
  const sandbox = currentSandbox;

  track('Save Modified Modules');
  // In case you don't own the sandbox we cannot do >1 calls for saving module as you would then
  // also fork >1 times. The reason that we want to save seperately is because we want to have
  // fine-grained control of which saves succeed and which saves fail
  if (sandbox.owned) {
    sandbox.modules
      .filter(m => changedModuleShortids.includes(m.shortid))
      .forEach(module => {
        codeSaved({
          code: module.code,
          moduleShortid: module.shortid,
        });
      });
  } else {
    saveClicked();
  }
}
