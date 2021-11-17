/* eslint-disable no-else-return */
/* eslint-disable no-continue */
import gensync, { Gensync } from 'gensync';
import micromatch from 'micromatch';

import * as pathUtils from '@codesandbox/common/lib/utils/path';
import { ModuleNotFoundError } from './errors/ModuleNotFound';

const EMPTY_SHIM = '//empty.js';

// alias/exports/main keys, sorted from high to low priority
const EXPORTS_KEYS = ['browser', 'development', 'default', 'require', 'import'];
const MAIN_PKG_FIELDS = ['module', 'browser', 'main', 'jsnext:main'];
const PKG_ALIAS_FIELDS = ['browser', 'alias'];

export type PackageCache = Map<string, any>;

export type FnIsFile = Gensync<(filepath: string) => boolean>;
export type FnReadFile = Gensync<(filepath: string) => string>;

export interface IResolveOptionsInput {
  filename: string;
  extensions: string[];
  isFile: FnIsFile;
  readFile: FnReadFile;
  moduleDirectories?: string[];
  packageCache?: PackageCache;
}

interface IResolveOptions extends IResolveOptionsInput {
  moduleDirectories: string[];
  packageCache: PackageCache;
}

export function getParentDirectories(
  filepath: string,
  rootDir: string = '/'
): string[] {
  const parts = filepath.split('/');
  const directories = [];
  while (parts.length > 0) {
    const directory = parts.join('/') || '/';
    // Test /foo vs /foo-something - /foo-something is not in rootDir
    if (directory.length < rootDir.length || !directory.startsWith(rootDir)) {
      break;
    }
    directories.push(directory);
    parts.pop();
  }
  return directories;
}

function normalizeAliasFilePath(
  specifier: string,
  pkgRoot: string,
  // This can be set to false to fallback to returning the specifier in case it can be a node_module
  isFilePath: boolean = true
): string {
  if (specifier[0] === '/') {
    return specifier;
  }
  if (specifier[0] === '.' || isFilePath) {
    return pathUtils.join(pkgRoot, specifier);
  }
  return specifier;
}

function normalizeResolverOptions(opts: IResolveOptionsInput): IResolveOptions {
  const normalizedModuleDirectories: Set<string> = opts.moduleDirectories
    ? new Set(
        opts.moduleDirectories.map(p => (p[0] === '/' ? p.substring(1) : p))
      )
    : new Set();
  normalizedModuleDirectories.add('node_modules');

  return {
    filename: opts.filename,
    extensions: [...new Set(['', ...opts.extensions])],
    isFile: opts.isFile,
    readFile: opts.readFile,
    moduleDirectories: [...normalizedModuleDirectories],
    packageCache: opts.packageCache || new Map(),
  };
}

type AliasesDict = { [key: string]: string };
interface ProcessedPackageJSON {
  aliases: AliasesDict;
}

function normalizePackageExport(filepath: string, pkgRoot: string): string {
  return normalizeAliasFilePath(filepath.replace(/\*/g, '$1'), pkgRoot);
}

type PackageExportObj = {
  [key: string]: string | null | false | PackageExportType;
};

type PackageExportArr = Array<PackageExportObj | string>;

type PackageExportType =
  | string
  | null
  | false
  | PackageExportObj
  | PackageExportArr;

function extractPathFromExport(
  exportValue: PackageExportType,
  pkgRoot: string
): string | false {
  if (!exportValue) {
    return false;
  } else if (typeof exportValue === 'string') {
    return normalizePackageExport(exportValue, pkgRoot);
  } else if (Array.isArray(exportValue)) {
    const foundPaths = exportValue
      .map(v => extractPathFromExport(v, pkgRoot))
      .filter(Boolean);
    if (!foundPaths.length) {
      return false;
    } else {
      return foundPaths[0];
    }
  } else if (typeof exportValue === 'object') {
    for (const key of EXPORTS_KEYS) {
      const exportFilename = exportValue[key];
      if (exportFilename !== undefined) {
        if (typeof exportFilename === 'string') {
          return normalizePackageExport(exportFilename, pkgRoot);
        } else {
          return extractPathFromExport(exportFilename, pkgRoot);
        }
      }
    }
    return false;
  } else {
    throw new Error(`Unsupported export type ${typeof exportValue}`);
  }
}

export function _processPackageJSON(
  content: any,
  pkgRoot: string
): ProcessedPackageJSON {
  if (!content || typeof content !== 'object') {
    return { aliases: {} };
  }

  const aliases: AliasesDict = {};
  for (const mainField of MAIN_PKG_FIELDS) {
    if (typeof content[mainField] === 'string') {
      aliases[pkgRoot] = normalizeAliasFilePath(content[mainField], pkgRoot);
      break;
    }
  }

  if (content.browser === false) {
    aliases[pkgRoot] = EMPTY_SHIM;
  }

  for (const aliasFieldKey of PKG_ALIAS_FIELDS) {
    const aliasField = content[aliasFieldKey];
    if (typeof aliasField === 'object') {
      for (const key of Object.keys(aliasField)) {
        const val = aliasField[key] || EMPTY_SHIM;
        const normalizedKey = normalizeAliasFilePath(key, pkgRoot, false);
        const normalizedValue = normalizeAliasFilePath(val, pkgRoot, false);
        aliases[normalizedKey] = normalizedValue;

        if (aliasFieldKey !== 'browser') {
          aliases[`${normalizedKey}/*`] = `${normalizedValue}/$1`;
        }
      }
    }
  }

  if (content.exports) {
    if (typeof content.exports === 'string') {
      aliases[pkgRoot] = normalizeAliasFilePath(content.exports, pkgRoot);
    } else if (typeof content.exports === 'object') {
      for (const exportKey of Object.keys(content.exports)) {
        const exportValue = extractPathFromExport(
          content.exports[exportKey],
          pkgRoot
        );
        const normalizedKey = normalizeAliasFilePath(exportKey, pkgRoot);
        aliases[normalizedKey] = exportValue || EMPTY_SHIM;
      }
    }
  }

  return { aliases };
}

interface IFoundPackageJSON {
  filepath: string;
  content: ProcessedPackageJSON;
}

function* loadPackageJSON(
  filepath: string,
  opts: IResolveOptions,
  rootDir: string = '/'
): Generator<any, IFoundPackageJSON | null, any> {
  const directories = getParentDirectories(filepath, rootDir);
  for (const directory of directories) {
    const packageFilePath = pathUtils.join(directory, 'package.json');
    let packageContent = opts.packageCache.get(packageFilePath);
    if (packageContent === undefined) {
      try {
        packageContent = _processPackageJSON(
          JSON.parse(yield* opts.readFile(packageFilePath)),
          pathUtils.dirname(packageFilePath)
        );
        opts.packageCache.set(packageFilePath, packageContent);
      } catch (err) {
        opts.packageCache.set(packageFilePath, false);
      }
    }
    if (packageContent) {
      return {
        filepath: packageFilePath,
        content: packageContent,
      };
    }
  }
  return null;
}

function resolveFile(filepath: string, dir: string): string {
  switch (filepath[0]) {
    case '.':
      return pathUtils.join(dir, filepath);
    case '/':
      return filepath;
    default:
      // is a node module
      return filepath;
  }
}

function loadAlias(pkgJson: IFoundPackageJSON, filename: string): string {
  const aliases = pkgJson.content.aliases;

  let relativeFilepath = filename;
  let aliasedPath = relativeFilepath;
  let count = 0;
  do {
    relativeFilepath = aliasedPath;

    // Simply check to ensure we don't infinitely alias files due to a misconfiguration of a package/user
    if (count > 5) {
      throw new Error('Could not resolve file due to a cyclic alias');
    }
    count++;

    // Check for direct matches
    if (aliases[relativeFilepath]) {
      aliasedPath = aliases[relativeFilepath];
      continue;
    }

    for (const aliasKey of Object.keys(aliases)) {
      if (!aliasKey.includes('*')) {
        continue;
      }

      const re = micromatch.makeRe(aliasKey, { capture: true });
      if (re.test(relativeFilepath)) {
        const val = aliases[aliasKey];
        aliasedPath = relativeFilepath.replace(re, val);
        if (aliasedPath.startsWith(relativeFilepath)) {
          const newAddition = aliasedPath.substr(relativeFilepath.length);
          if (
            !newAddition.includes('/') &&
            relativeFilepath.endsWith(newAddition)
          ) {
            aliasedPath = relativeFilepath;
          }
        }
        break;
      }
    }

    // No new aliased path
    break;
  } while (relativeFilepath !== aliasedPath);

  return aliasedPath || relativeFilepath;
}

function* resolveModule(
  moduleSpecifier: string,
  opts: IResolveOptions
): Generator<any, string, any> {
  const dirPath = pathUtils.dirname(opts.filename);
  const filename = resolveFile(moduleSpecifier, dirPath);
  const isAbsoluteFilename = filename[0] === '/';
  const pkgJson = yield* findPackageJSON(
    isAbsoluteFilename ? filename : opts.filename,
    opts
  );
  return loadAlias(pkgJson, filename);
}

const extractPkgSpecifierParts = (specifier: string) => {
  const parts = specifier.split('/');
  const pkgName =
    parts[0][0] === '@' ? parts.splice(0, 2).join('/') : parts.shift();
  return {
    pkgName,
    filepath: parts.join('/'),
  };
};

function* resolveNodeModule(
  moduleSpecifier: string,
  opts: IResolveOptions
): Generator<any, string, any> {
  const pkgSpecifierParts = extractPkgSpecifierParts(moduleSpecifier);
  const directories = getParentDirectories(opts.filename);
  for (const modulesPath of opts.moduleDirectories) {
    for (const directory of directories) {
      const rootDir = pathUtils.join(
        directory,
        modulesPath,
        pkgSpecifierParts.pkgName
      );
      const pkgFilePath = pathUtils.join(rootDir, pkgSpecifierParts.filepath);
      const pkgJson = yield* loadPackageJSON(pkgFilePath, opts, rootDir);
      if (pkgJson) {
        try {
          return yield* resolver(pkgFilePath, {
            ...opts,
            filename: pkgJson.filepath,
          });
        } catch (err) {
          if (!pkgSpecifierParts.filepath) {
            return yield* resolver(pathUtils.join(pkgFilePath, 'index'), {
              ...opts,
              filename: pkgJson.filepath,
            });
          }
          throw err;
        }
      }
    }
  }
  throw new ModuleNotFoundError(moduleSpecifier, opts.filename);
}

function* findPackageJSON(
  filepath: string,
  opts: IResolveOptions
): Generator<any, IFoundPackageJSON, any> {
  let pkg = yield* loadPackageJSON(filepath, opts);
  if (!pkg) {
    pkg = yield* loadPackageJSON('/index', opts);
    if (!pkg) {
      return {
        filepath: '/package.json',
        content: {
          aliases: {},
        },
      };
    }
  }
  return pkg;
}

function* expandFile(
  filepath: string,
  opts: IResolveOptions,
  expandCount: number = 0
): Generator<any, string | null, any> {
  const pkg = yield* findPackageJSON(filepath, opts);

  if (expandCount > 5) {
    throw new Error('Cyclic alias detected');
  }

  for (const ext of opts.extensions) {
    const f = filepath + ext;
    const aliasedPath = loadAlias(pkg, f);
    if (aliasedPath === f) {
      const exists = yield* isFile(f, opts.isFile);
      if (exists) {
        return f;
      }
    } else {
      const expanded = yield* expandFile(
        aliasedPath,
        { ...opts, extensions: [''] },
        expandCount + 1
      );
      if (expanded) {
        return expanded;
      }
    }
  }
  return null;
}

function* isFile(
  filepath: string,
  isFileFn: FnIsFile
): Generator<any, boolean, any> {
  if (filepath === EMPTY_SHIM) {
    return true;
  }
  return yield* isFileFn(filepath);
}

export function normalizeModuleSpecifier(specifier: string): string {
  const normalized = specifier.replace(/(\/|\\)+/g, '/');
  if (normalized.endsWith('/')) {
    return normalized.substring(0, normalized.length - 1);
  }
  return normalized;
}

export const resolver = gensync<
  (moduleSpecifier: string, inputOpts: IResolveOptionsInput) => string
>(function* resolve(moduleSpecifier, inputOpts): Generator<any, string, any> {
  const normalizedSpecifier = normalizeModuleSpecifier(moduleSpecifier);
  const opts = normalizeResolverOptions(inputOpts);
  const modulePath = yield* resolveModule(normalizedSpecifier, opts);

  if (modulePath[0] !== '/') {
    try {
      return yield* resolveNodeModule(modulePath, opts);
    } catch (e) {
      throw new ModuleNotFoundError(normalizedSpecifier, opts.filename);
    }
  }

  let foundFile = yield* expandFile(modulePath, opts);
  if (!foundFile) {
    foundFile = yield* expandFile(pathUtils.join(modulePath, 'index'), opts);
  }

  if (!foundFile) {
    throw new ModuleNotFoundError(modulePath, opts.filename);
  }

  return foundFile;
});

export const resolveSync = resolver.sync;
export const resolveAsync = resolver.async;
