export function currentSandbox() {
  return this.sandboxes.get(this.currentId);
}

export function isAllModulesSynced() {
  return !this.changedModules.length;
}

export function currentModule() {
  return this.currentSandbox.modules.find(
    module => module.shortid === this.currentModuleShortid
  );
}

export function mainModule() {
  return this.currentSandbox.modules.find(
    module => module.shortid === this.mainModuleShortid
  );
}
