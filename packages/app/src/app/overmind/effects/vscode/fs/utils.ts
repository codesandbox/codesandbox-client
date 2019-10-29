import {
  Module,
  SandboxFs,
  SandboxFsModule,
  Directory,
  SandboxFsDirectory,
} from '@codesandbox/common/lib/types';

export const writeFile = (fs: SandboxFs, path: string, module: Module) => {
  fs[path] = { ...module, type: 'file' } as SandboxFsModule;
};

export const rename = (fs: SandboxFs, fromPath: string, toPath: string) => {
  Object.keys(fs).forEach(path => {
    if (path.startsWith(fromPath)) {
      const newPath = path.replace(fromPath, toPath);
      const module = fs[path];

      delete fs[path];
      fs[newPath] = module;
    }
  });
};

export const rmdir = (fs: SandboxFs, removePath: string) => {
  Object.keys(fs).forEach(path => {
    if (path.startsWith(removePath)) {
      delete fs[path];
    }
  });
};

export const unlink = (fs: SandboxFs, removePath: string) => {
  delete fs[removePath];
};

export const mkdir = (fs: SandboxFs, path: string, directory: Directory) => {
  fs[path] = { ...directory, type: 'directory' } as SandboxFsDirectory;
};
