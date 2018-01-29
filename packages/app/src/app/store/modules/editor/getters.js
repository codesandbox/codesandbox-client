import { resolveModule } from 'common/sandbox/modules';
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

const resolveModuleWrapped = sandbox => (path: string) => {
  try {
    return resolveModule(path, sandbox.modules, sandbox.directories);
  } catch (e) {
    return undefined;
  }
};

export function parsedConfigurations() {
  const sandbox = this.currentSandbox;
  const templateDefinition = getDefinition(sandbox.template);

  return parseConfigurations(
    sandbox.template,
    templateDefinition.configurationFiles,
    resolveModuleWrapped(sandbox),
    sandbox
  );
}

export function mainModule() {
  const sandbox = this.currentSandbox;
  const templateDefinition = getDefinition(sandbox.template);

  const resolve = resolveModuleWrapped(sandbox);

  try {
    const nPath = templateDefinition
      .getEntries(this.parsedConfigurations)
      .find(p => resolve(p));

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
