import { Directory, Module } from '@codesandbox/common/lib/types';

import {
  IDirectoryAPIResponse,
  IModuleAPIResponse,
  SandboxAPIResponse,
} from '../api/types';

export function transformModule(module: IModuleAPIResponse): Module {
  return {
    ...module,
    code: typeof module.code === 'string' ? module.code : '',
    savedCode: null,
    isNotSynced: false,
    errors: [],
    corrections: [],
    type: 'file' as 'file',
    path: null,
  };
}

export function transformDirectory(
  directory: IDirectoryAPIResponse
): Directory {
  return {
    ...directory,
    type: 'directory' as 'directory',
    path: null,
  };
}

export function transformSandbox(sandbox: SandboxAPIResponse) {
  // We need to add client side properties for tracking
  return {
    ...sandbox,
    environmentVariables: null,
    modules: sandbox.modules.map(transformModule),
    directories: sandbox.directories.map(transformDirectory),
  };
}
