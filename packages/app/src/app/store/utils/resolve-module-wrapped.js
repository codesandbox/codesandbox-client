import { resolveModule } from 'common/sandbox/modules';

export const resolveModuleWrapped = sandbox => (path: string) => {
  try {
    return resolveModule(path, sandbox.modules, sandbox.directories);
  } catch (e) {
    return undefined;
  }
};
