import { generateFileFromSandbox } from 'common/templates/configuration/package-json';
import { getModulePath } from 'common/sandbox/modules';
import getTemplate from 'common/templates';
import { parseConfigurations } from '../../utils/parse-configurations';
import { mainModule as getMainModule } from '../../utils/main-module';

export function currentSandbox() {
  return this.sandboxes.get(this.currentId);
}

export function isAllModulesSynced() {
  return !this.changedModuleShortids.length;
}

export function currentModule() {
  return (
    this.currentSandbox.modules.find(
      module => module.shortid === this.currentModuleShortid
    ) || {}
  );
}

export function modulesByPath() {
  const modulesObject = {};

  this.currentSandbox.modules.forEach(m => {
    const path = getModulePath(
      this.currentSandbox.modules,
      this.currentSandbox.directories,
      m.id
    );
    if (path) {
      modulesObject[path] = m;
    }
  });

  return modulesObject;
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

/**
 * We have two types of editors in CodeSandbox: an editor focused on smaller projects and
 * an editor that works with bigger projects that run on a container. The advanced editor
 * only has added features, so it's a subset on top of the existing editor.
 */
export function isAdvancedEditor() {
  const currentSandbox = this.currentSandbox;
  if (!currentSandbox) {
    return false;
  }

  const isServer = getTemplate(currentSandbox.template).isServer;

  return isServer && currentSandbox.owned;
}

export function parsedConfigurations() {
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
