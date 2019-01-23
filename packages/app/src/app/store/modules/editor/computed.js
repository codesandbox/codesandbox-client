export function isModuleSynced(moduleShortid) {
  return this.changedModuleShortids.indexOf(moduleShortid) === -1;
}

function getModuleParents(modules, directories, id) {
  const module = modules.find(moduleEntry => moduleEntry.id === id);

  if (!module) return [];

  let directory = directories.find(
    directoryEntry => directoryEntry.shortid === module.directoryShortid
  );
  let directoryIds = [];
  while (directory != null) {
    directoryIds = [...directoryIds, directory.id];
    directory = directories.find(
      directoryEntry => directoryEntry.shortid === directory.directoryShortid // eslint-disable-line
    );
  }

  return directoryIds;
}

export function shouldDirectoryBeOpen(directoryShortid) {
  const { modules, directories } = this.currentSandbox;
  const currentModuleId = this.currentModule.id;
  const currentModuleParents = getModuleParents(
    modules,
    directories,
    currentModuleId
  );

  const isParentOfModule = currentModuleParents.includes(directoryShortid);
  return isParentOfModule;
}
