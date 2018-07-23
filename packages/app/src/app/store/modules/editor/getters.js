import { generateFileFromSandbox } from 'common/templates/configuration/package-json';
import { parseConfigurations } from '../../utils/parse-configurations';
import { mainModule as getMainModule } from '../../utils/main-module';

export function currentSandbox() {
  return this.sandboxes.get(this.currentId);
}

export function isAllModulesSynced() {
  return !this.changedModuleShortids.length;
}

export function currentModule() {
  return this.currentSandbox.modules.find(
    module => module.shortid === this.currentModuleShortid
  );
}

export function currentTab() {
  const currentTabId = this.currentTabId;
  const tabs = this.tabs;
  const currentModuleShortid = this.currentModuleShortid;

  if (currentTabId) {
    const foundTab = this.tabs.find(tab => tab.id === currentTabId);

    if (foundTab) {
      return foundTab;
    }
  }

  return tabs.find(tab => tab.moduleShortid === currentModuleShortid);
}

// Will be used in the future
// export function normalizedModules() {
//   const sandbox = this.currentSandbox;

//   const modulesObject = {};

//   sandbox.modules.forEach(m => {
//     const path = getModulePath(sandbox.modules, sandbox.directories, m.id);
//     modulesObject[path] = {
//       path,
//       code: m.code,
//     };
//   });

//   return modulesObject;
// }

export function parsedConfigurations() {
  console.log(this.currentSandbox.toJSON());
  console.log(parseConfigurations(this.currentSandbox));
  return parseConfigurations(this.currentSandbox);
}

export function mainModule() {
  return getMainModule(this.currentSandbox, this.parsedConfigurations);
}

export function currentPackageJSON() {
  const module = this.currentSandbox.modules.find(
    m => m.directoryShortid == null && m.title === 'package.json'
  );

  return module;
}

export function currentPackageJSONCode() {
  return this.currentPackageJSON
    ? this.currentPackageJSON.code
    : generateFileFromSandbox(this.currentSandbox);
}
