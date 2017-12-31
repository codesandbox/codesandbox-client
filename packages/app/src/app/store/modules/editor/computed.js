export function isModuleSynced(moduleShortid) {
  return this.changedModuleShortids.indexOf(moduleShortid) === -1;
}
