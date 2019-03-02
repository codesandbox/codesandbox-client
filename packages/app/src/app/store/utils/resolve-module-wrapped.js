import { resolveModule, resolveDirectory } from 'common/lib/sandbox/modules';

export const resolveModuleWrapped = sandbox => (path: string) => {
  try {
    return resolveModule(path, sandbox.modules, sandbox.directories);
  } catch (e) {
    return undefined;
  }
};

export const resolveDirectoryWrapped = sandbox => (path: string) => {
  try {
    return resolveDirectory(path, sandbox.modules, sandbox.directories);
  } catch (e) {
    return undefined;
  }
};
