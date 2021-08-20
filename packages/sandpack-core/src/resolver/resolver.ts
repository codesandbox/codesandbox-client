/* eslint-disable no-continue */
import gensync, { Gensync } from 'gensync';
import micromatch from 'micromatch';

import * as pathUtils from '@codesandbox/common/lib/utils/path';

const EMPTY_SHIM = '//empty.js';

// alias/exports/main keys, sorted from high to low priority
const EXPORTS_KEYS = ['browser', 'development', 'default'];
const MAIN_PKG_FIELDS = ['module', 'browser', 'main', 'jsnext:main'];
const PKG_ALIAS_FIELDS = ['browser', 'alias'];

export type PackageCache = Map<string, any>;

export type FnIsFile = Gensync<(filepath: string) => boolean>;
export type FnReadFile = Gensync<(filepath: string) => string>;

interface IResolveOptionsInput {
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

function processPackageExportsObject(
  exports: {
    [key: string]: string | null | false;
  },
  pkgRoot: string
): string | false {
  for (const key of EXPORTS_KEYS) {
    const exportFilename = exports[key];
    if (exportFilename !== undefined) {
      return typeof exportFilename === 'string'
        ? normalizePackageExport(exportFilename, pkgRoot)
        : false;
    }
  }
  return false;
}

function processPackageJSON(
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
        aliases[`${normalizedKey}/*`] = `${normalizedValue}/$1`;
      }
    }
  }

  if (content.exports) {
    if (typeof content.exports === 'string') {
      aliases[pkgRoot] = normalizeAliasFilePath(content.exports, pkgRoot);
    } else if (typeof content.exports === 'object') {
      for (const exportKey of Object.keys(content.exports)) {
        const exportValue = content.exports[exportKey];
        const normalizedKey = normalizeAliasFilePath(exportKey, pkgRoot);
        if (typeof exportValue === 'string') {
          aliases[normalizedKey] = normalizeAliasFilePath(exportValue, pkgRoot);
        } else if (typeof exportValue === 'object') {
          aliases[normalizedKey] =
            processPackageExportsObject(exportValue, pkgRoot) || EMPTY_SHIM;
        }
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
  opts: IResolveOptions
): Generator<any, IFoundPackageJSON | null, any> {
  const parts = filepath.split('/');
  while (parts.length > 0) {
    const packageFilePath = parts.join('/') + '/package.json';
    let packageContent = opts.packageCache.get(packageFilePath);
    if (!opts.packageCache.has(packageFilePath)) {
      try {
        packageContent = processPackageJSON(
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
    parts.pop();
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
    if (count > 10) {
      throw new Error('Could not resolve file due to a cyclic alias');
    }
    count++;

    // Check for direct matches
    if (aliases[relativeFilepath]) {
      aliasedPath = aliases[relativeFilepath];
      continue;
    }

    const matchers = Object.keys(aliases).filter(a => a.includes('*'));
    for (const matcher of matchers) {
      const re = micromatch.makeRe(matcher, { capture: true });
      if (re.test(relativeFilepath)) {
        const val = aliases[matcher];
        aliasedPath = relativeFilepath.replace(re, val);
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
  for (const modulesPath of opts.moduleDirectories) {
    const parts = opts.filename.split('/');
    while (parts.length > 0) {
      const packageJsonPath = [
        ...parts,
        modulesPath,
        pkgSpecifierParts.pkgName,
        'package.json',
      ].join('/');
      const pkgExists = yield* isFile(packageJsonPath, opts.isFile);
      if (pkgExists) {
        try {
          const filepath = pkgSpecifierParts.filepath
            ? './' + pkgSpecifierParts.filepath
            : '.';
          return yield* resolverRunner(filepath, {
            ...opts,
            filename: packageJsonPath,
          });
        } catch (err) {
          if (!pkgSpecifierParts.filepath) {
            return yield* resolverRunner('./index', {
              ...opts,
              filename: packageJsonPath,
            });
          }
          throw err;
        }
      }
      parts.pop();
    }
  }
  throw new Error(`Could not find module ${moduleSpecifier}`);
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

  if (expandCount > 15) {
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

const resolverRunner = gensync<
  (moduleSpecifier: string, inputOpts: IResolveOptionsInput) => string
>(function* resolve(moduleSpecifier, inputOpts): Generator<any, string, any> {
  const opts = normalizeResolverOptions(inputOpts);
  const modulePath = yield* resolveModule(moduleSpecifier, opts);

  if (modulePath[0] !== '/') {
    try {
      return yield* resolveNodeModule(modulePath, opts);
    } catch (e) {
      throw new Error(`Could not find ${moduleSpecifier} in ${opts.filename}`);
    }
  }

  let foundFile = yield* expandFile(modulePath, opts);
  if (!foundFile) {
    foundFile = yield* expandFile(pathUtils.join(modulePath, 'index'), opts);
  }

  if (!foundFile) {
    throw new Error(`Cannot find module ${foundFile}`);
  }

  return foundFile;
});

export const resolveSync = resolverRunner.sync;
export const resolveAsync = resolverRunner.async;
