export function isModuleSynced(moduleShortid) {
  return !this.changedModuleShortids.contains(moduleShortid);
}
