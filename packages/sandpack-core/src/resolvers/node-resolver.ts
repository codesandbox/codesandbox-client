/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-else-return */
/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */
import * as pathUtils from '@codesandbox/common/lib/utils/path';
import { PackageJSON } from '@codesandbox/common/lib/types';

import { Resolver, IResolveOpts, IResolverResult } from './resolver';
import { DEFAULT_EXTENSIONS } from '../utils/extensions';
import { findFirstFile } from './utils';

export const MAIN_FIELDS = ['browser', 'main', 'module', 'source'];

export interface IModuleLocationData {
  moduleName?: string;
  subPath?: string;
  moduleDir?: string;
  filePath?: string;
  code?: string;
}

export interface InternalPackageJSON extends PackageJSON {
  pkgdir: string;
  pkgfile: string;
}

export interface IResolvedFile {
  path: string;
  pkg: InternalPackageJSON | null;
}

function getModuleParts(name: string): [string, string | undefined] {
  name = pathUtils.normalize(name);
  let splitOn = name.indexOf('/');
  if (name.charAt(0) === '@') {
    splitOn = name.indexOf('/', splitOn + 1);
  }
  if (splitOn < 0) {
    return [name, undefined];
  } else {
    return [
      name.substring(0, splitOn),
      name.substring(splitOn + 1) || undefined,
    ];
  }
}

function getExtensions(
  defaultExtensions: Array<string>,
  parent: string
): Array<string> {
  // Get file extensions to search
  let extensions = (defaultExtensions || DEFAULT_EXTENSIONS).slice();

  if (parent) {
    // parent's extension given high priority
    const parentExt = pathUtils.extname(parent);
    extensions = [parentExt, ...extensions.filter(ext => ext !== parentExt)];
  }

  extensions.unshift('');

  return extensions;
}

// TODO: Support exports?
export class NodeResolver extends Resolver {
  async resolveModule(
    filename: string,
    parent: string
  ): Promise<IModuleLocationData> {
    let parentFilePath = parent || '/index';

    // If this isn't the entrypoint, resolve the input file to an absolute path
    if (parent) {
      filename = await this.resolveFilename(
        filename,
        pathUtils.dirname(parentFilePath)
      );
    }

    // Return just the file path if this is a file, not in node_modules
    if (pathUtils.isAbsolute(filename)) {
      return {
        filePath: filename,
      };
    }

    // let builtin = this.findBuiltin(filename, env);
    // if (builtin || builtin === null) {
    //   return builtin;
    // }

    // Resolve the module in node_modules
    let resolved;
    try {
      resolved = this.findNodeModulePath(filename, parentFilePath);
    } catch (err) {
      // ignore
    }

    // If we couldn't resolve the node_modules path, just return the module name info
    if (resolved === undefined) {
      let [moduleName, subPath] = getModuleParts(filename);
      resolved = {
        moduleName,
        subPath,
      };
    }

    return resolved;
  }

  async resolveFilename(filename: string, dir: string): Promise<string> {
    switch (filename[0]) {
      // Absolute path. Resolve relative to project root.
      case '/': {
        return filename;
      }

      // Relative path.
      case '.': {
        return pathUtils.resolve(dir, filename);
      }

      // Module
      default: {
        return filename;
      }
    }
  }

  findNodeModulePath(
    filename: string,
    sourceFile: string
  ): IModuleLocationData | undefined {
    let [moduleName, subPath] = getModuleParts(filename);

    let moduleDir = `/node_modules/${moduleName}`;
    if (moduleDir) {
      return {
        moduleName,
        subPath,
        moduleDir,
        filePath: subPath ? pathUtils.join(moduleDir, subPath) : moduleDir,
      };
    }

    return undefined;
  }

  findPkgRoot(sourceFile: string): string {
    let dir = pathUtils.dirname(sourceFile);
    if (!dir.startsWith('/node_modules/')) {
      return '/';
    } else {
      let dirParts = dir.split('/');
      if (dirParts.length < 3) {
        throw new Error('Invalid node_module filepath');
      }
      return dirParts.slice(0, dirParts[3][0] === '@' ? 4 : 3).join('/');
    }
  }

  async readPackage(dirname: string): Promise<InternalPackageJSON> {
    const filepath = pathUtils.join(dirname, 'package.json');
    const content = await this.fs.readFile(filepath);
    return {
      pkgdir: dirname,
      pkgfile: filepath,
      ...JSON.parse(content),
    };
  }

  expandFile(file: string, extensions: Array<string>): Array<string> {
    return extensions.map(ext => file + ext);
  }

  async loadAsFile({
    file,
    extensions,
    pkg,
  }: {
    file: string;
    extensions: Array<string>;
    pkg: InternalPackageJSON | null;
  }): Promise<IResolvedFile | null> {
    // Try all supported extensions
    let filenames = this.expandFile(file, extensions);
    let found = await findFirstFile(this.fs, filenames);
    if (found) {
      return { path: found, pkg };
    }
    return null;
  }

  getPackageEntries(pkg: InternalPackageJSON) {
    return MAIN_FIELDS.map(field => {
      if (field === 'browser' && pkg.browser != null) {
        if (typeof pkg.browser === 'string') {
          return { field, filename: pkg.browser };
        } else if (typeof pkg.browser === 'object' && pkg.browser[pkg.name]) {
          return {
            field: `browser/${pkg.name}`,
            filename: pkg.browser[pkg.name],
          };
        }
      }

      return {
        field,
        // @ts-ignore
        filename: pkg[field],
      };
    })
      .filter(
        entry => entry && entry.filename && typeof entry.filename === 'string'
      )
      .map(entry => {
        // Current dir refers to an index file
        if (entry.filename === '.' || entry.filename === './') {
          entry.filename = 'index';
        }

        return {
          field: entry.field,
          filename: pathUtils.resolve(pkg.pkgdir, entry.filename),
        };
      });
  }

  async loadDirectory({
    dir,
    extensions,
    pkg = null,
  }: {
    dir: string;
    extensions: Array<string>;
    pkg?: InternalPackageJSON | null;
  }): Promise<IResolvedFile | null> {
    let error = null;
    try {
      pkg = await this.readPackage(dir);

      if (pkg) {
        // Get a list of possible package entry points.
        let entries = this.getPackageEntries(pkg);

        for (let entry of entries) {
          // First try loading package.main as a file, then try as a directory.
          let res =
            (await this.loadAsFile({
              file: entry.filename,
              extensions,
              pkg,
            })) ||
            (await this.loadDirectory({
              dir: entry.filename,
              extensions,
              pkg,
            }));

          if (res) {
            return res;
          } else {
            error = new Error(
              `Could not load '${entry}' from module '${pkg.name}' found in package.json#${entry.field}`
            );
          }
        }
      }
    } catch (err) {
      // do nothing
    }

    // Fall back to an index file inside the directory.
    const indexFile = await this.loadAsFile({
      file: pathUtils.join(dir, 'index'),
      extensions,
      pkg,
    });

    if (!indexFile && error) {
      throw error;
    }

    return indexFile;
  }

  async loadRelative(
    filename: string,
    extensions: Array<string>,
    parentdir: string
  ): Promise<IResolvedFile | undefined> {
    // Find a package.json file in the current package.
    let pkgRoot = this.findPkgRoot(filename);
    let pkg = await this.readPackage(pkgRoot);

    // First try as a file, then as a directory.
    let resolvedFile =
      (await this.loadAsFile({
        file: filename,
        extensions,
        pkg,
      })) ||
      (await this.loadDirectory({
        dir: filename,
        extensions,
        pkg,
      }));

    if (!resolvedFile) {
      throw new Error(`Cannot load file '${filename}' in '${parentdir}'.`);
    }

    return resolvedFile;
  }

  async loadNodeModules(
    module: IModuleLocationData,
    extensions: Array<string>
  ): Promise<IResolvedFile | null> {
    if (!module.filePath) {
      throw new Error('Module filepath is undefined');
    }

    // If a module was specified as a module sub-path (e.g. some-module/some/path),
    // it is likely a file. Try loading it as a file first.
    if (module.subPath && module.moduleDir) {
      let pkg = await this.readPackage(module.moduleDir);
      let res = await this.loadAsFile({
        file: module.filePath,
        extensions,
        pkg,
      });

      if (res) {
        return res;
      }
    }

    // Otherwise, load as a directory.
    return this.loadDirectory({
      dir: module.filePath,
      extensions,
    });
  }

  async resolve(
    opts: IResolveOpts
  ): Promise<IResolverResult | null | undefined> {
    let { filename, parent = '/index', extensions } = opts;
    extensions = getExtensions(extensions, parent);

    // Resolve the module directory or local file path
    let module = await this.resolveModule(filename, parent);

    let resolved;
    if (module.moduleDir) {
      resolved = await this.loadNodeModules(module, extensions);
    } else if (module.filePath) {
      if (module.code != null) {
        return {
          filepath: module.filePath,
          code: module.code,
          isDependency: true,
        };
      }

      resolved = await this.loadRelative(
        module.filePath,
        extensions,
        pathUtils.dirname(parent)
      );
    }

    if (resolved) {
      return {
        filepath: resolved.path,
        isDependency: false,
      };
    }

    // Could not find anything, return null, maybe another resolver can find something
    return null;
  }

  resolveSync(opts: IResolveOpts): IResolverResult {
    throw new Error('resolveSync is not implemented for this resolver');
  }

  // Clear the cache
  invalidateAll() {}
}
