import { resolveModule } from 'common/sandbox/modules';
import { absolute } from 'common/utils/path';
import { generateFileFromSandbox } from 'common/templates/configuration/package-json';

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

export function mainModule() {
  try {
    const { parsed } = this.currentParsedPackageJSON;

    const entry = absolute(parsed.main);

    return resolveModule(
      entry,
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

export function currentParsedPackageJSON() {
  let parsed = null;
  let error = null;

  try {
    parsed = JSON.parse(this.currentPackageJSONCode);
  } catch (e) {
    error = e;
  }

  return { parsed, error };
}

export function mainModuleShortid() {}
