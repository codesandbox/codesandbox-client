import { generateFileFromSandbox } from 'common/templates/configuration/package-json';
import { parseConfigurations } from '../../utils/parse-configurations';
import { mainModule as getMainModule } from '../../utils/main-module';
import { State } from './types'

export function currentSandbox(state: State) {
  return state.sandboxes.get(state.currentId);
}

export function isAllModulesSynced(state: State) {
  return !state.changedModuleShortids.length;
}

export function currentModule(state: State) {
  return state.currentSandbox.modules.find(
    module => module.shortid === state.currentModuleShortid
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

export function parsedConfigurations(state: State) {
  return parseConfigurations(state.currentSandbox);
}

export function mainModule(state: State) {
  return getMainModule(state.currentSandbox, state.parsedConfigurations);
}

export function currentPackageJSON(state: State) {
  const module = state.currentSandbox.modules.find(
    m => m.directoryShortid == null && m.title === 'package.json'
  );

  return module;
}

export function currentPackageJSONCode(state: State) {
  return state.currentPackageJSON
    ? state.currentPackageJSON.code
    : generateFileFromSandbox(state.currentSandbox);
}
