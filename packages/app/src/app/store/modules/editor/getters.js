import { resolveModule, getModulePath } from 'common/sandbox/modules';
import { absolute } from 'common/utils/path';
import getDefinition from 'common/templates';
import { generateFileFromSandbox } from 'common/templates/configuration/package-json';
import parseConfigurations from 'common/templates/configuration/parse';

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

export function normalizedModules() {
  const sandbox = this.currentSandbox;

  const modulesObject = {};

  sandbox.modules.forEach(m => {
    const path = getModulePath(sandbox.modules, sandbox.directories, m.id);
    modulesObject[path] = {
      path,
      code: m.code,
    };
  });

  return modulesObject;
}

export function parsedConfigurations() {
  const sandbox = this.currentSandbox;
  const templateDefinition = getDefinition(sandbox.template);

  return parseConfigurations(
    sandbox.template,
    templateDefinition.configurationFiles,
    this.normalizedModules
  );
}

export function mainModule() {
  const sandbox = this.currentSandbox;
  const templateDefinition = getDefinition(sandbox.template);

  try {
    const nPath = templateDefinition
      .getEntries(this.parsedConfigurations)
      .find(p => this.normalizedModules[p]);

    return resolveModule(
      nPath,
      this.currentSandbox.modules,
      this.currentSandbox.directories
    );
  } catch (e) {
    return this.currentSandbox.modules.find(
      module => module.shortid === this.mainModuleShortid
    );
  }
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
