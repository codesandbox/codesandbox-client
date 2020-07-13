import { Directory, Module, SandboxFs } from '@codesandbox/common/lib/types';
import { json } from 'overmind';

export const appendFile = (fs: SandboxFs, module: Module) => {
  fs[module.path!] = module;
};

export const writeFile = (fs: SandboxFs, module: Module) => {
  fs[module.path!] = module;
};

export const rename = (fs: SandboxFs, fromPath: string, toPath: string) => {
  Object.keys(fs).forEach(path => {
    if (path.startsWith(fromPath + '/') || path === fromPath) {
      const newPath = path.replace(fromPath, toPath);
      const module = fs[path];

      delete fs[path];
      fs[newPath] = json(module);
    }
  });
};

export const rmdir = (fs: SandboxFs, directory: Directory) => {
  Object.keys(fs).forEach(path => {
    if (path.startsWith(directory.path!)) {
      delete fs[path];
    }
  });
};

export const unlink = (fs: SandboxFs, module: Module) => {
  delete fs[module.path!];
};

export const mkdir = (fs: SandboxFs, directory: Directory) => {
  fs[directory.path!] = directory;
};
