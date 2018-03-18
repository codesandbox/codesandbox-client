import computeType from 'app/utils/get-type';

export function isModuleSynced(moduleShortid) {
  return this.changedModuleShortids.indexOf(moduleShortid) === -1;
}

export function getType(moduleShortid) {
  const module = this.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  return computeType(module.title, module.code);
}
