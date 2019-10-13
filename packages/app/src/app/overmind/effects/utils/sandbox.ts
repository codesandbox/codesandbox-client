import { Sandbox, Module, Directory } from '@codesandbox/common/lib/types';

export function transformModule(module: Module) {
  return {
    ...module,
    savedCode: null,
    isNotSynced: false,
    errors: [],
    corrections: [],
    type: 'file' as 'file',
  };
}

export function transformDirectory(directory: Directory) {
  return {
    ...directory,
    type: 'directory' as 'directory',
  };
}

export function transformSandbox(sandbox: Sandbox) {
  // We need to add client side properties for tracking
  return {
    ...sandbox,
    environmentVariables: null,
    modules: sandbox.modules.map(transformModule),
    directories: sandbox.directories.map(transformDirectory),
  };
}
