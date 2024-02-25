/* eslint-disable no-else-return */
/* eslint-disable no-continue */
import gensync from 'gensync';
import micromatch from 'micromatch';

import * as pathUtils from '@codesandbox/common/lib/utils/path';
import { ModuleNotFoundError } from './errors/ModuleNotFound';
import { ProcessedPackageJSON, processPackageJSON } from './utils/pkg-json';
import { isFile, FnIsFile, FnReadFile, getParentDirectories } from './utils/fs';
import {
  ProcessedTSConfig,
  processTSConfig,
  getPotentialPathsFromTSConfig,
} from './utils/tsconfig';

export type ResolverCache = Map<string, any>;

export function invalidatePackageFromCache(
  pkgName: string,
  cache: ResolverCache
): void {
  const lowerPkgName = pkgName.toLowerCase();
  for (const [key] of cache) {
    if (key.toLowerCase().includes(lowerPkgName)) {
      cache.delete(key);
    }
  }
}

export interface IResolveOptionsInput {
  filename: string;
  extensions: string[];
  isFile: FnIsFile;
  readFile: FnReadFile;
  moduleDirectories?: string[];
  resolverCache?: ResolverCache;
  pkgJson?: IFoundPackageJSON;
}

interface IResolveOptions extends IResolveOptionsInput {
  moduleDirectories: string[];
  resolverCache: ResolverCache;
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
    resolverCache: opts.resolverCache || new Map(),
    pkgJson: opts.pkgJson,
  };
}

interface IFoundPackageJSON {
  filepath: string;
  content: ProcessedPackageJSON;
}

function* loadPackageJSON(
  directory: string,
  opts: IResolveOptions
): Generator<any, IFoundPackageJSON | null, any> {
  const packageFilePath = pathUtils.join(directory, 'package.json');
  let packageContent = opts.resolverCache.get(packageFilePath);
  if (packageContent === undefined) {
    try {
      packageContent = processPackageJSON(
        JSON.parse(yield* opts.readFile(packageFilePath)),
        pathUtils.dirname(packageFilePath)
      );
      opts.resolverCache.set(packageFilePath, packageContent);
    } catch (err) {
      opts.resolverCache.set(packageFilePath, false);
    }
  }
  if (packageContent) {
    return {
      filepath: packageFilePath,
      content: packageContent,
    };
  }
  return null;
}

function* loadNearestPackageJSON(
  filepath: string,
  opts: IResolveOptions,
  rootDir: string = '/'
): Generator<any, IFoundPackageJSON | null, any> {
  const directories = getParentDirectories(filepath, rootDir);
  for (const directory of directories) {
    const foundPackageJSON = yield* loadPackageJSON(directory, opts);

    if (foundPackageJSON) {
      return foundPackageJSON;
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

function resolveAlias(pkgJson: IFoundPackageJSON, filename: string): string {
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
  const pkgJson =
    opts.pkgJson ||
    (yield* findPackageJSON(
      isAbsoluteFilename ? filename : opts.filename,
      opts
    ));
  return resolveAlias(pkgJson, filename);
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

      try {
        const pkgFilePath = pathUtils.join(rootDir, pkgSpecifierParts.filepath);
        const rootPkgJson = yield* loadPackageJSON(rootDir, opts);
        const pkgJson =
          rootPkgJson && rootPkgJson.content.hasExports
            ? rootPkgJson
            : yield* loadNearestPackageJSON(pkgFilePath, opts, rootDir);
        if (pkgJson) {
          try {
            return yield* resolve(pkgFilePath, {
              ...opts,
              filename: pkgJson.filepath,
              pkgJson,
            });
          } catch (err) {
            if (!pkgSpecifierParts.filepath) {
              return yield* resolve(pathUtils.join(pkgFilePath, 'index'), {
                ...opts,
                filename: pkgJson.filepath,
              });
            }

            throw err;
          }
        }
      } catch (err) {
        // Handle multiple duplicates of a node_module across the tree
        if (directory.length > 1) {
          return yield* resolveNodeModule(moduleSpecifier, {
            ...opts,
            filename: pathUtils.dirname(directory),
          });
        }

        throw err;
      }
    }
  }
  throw new ModuleNotFoundError(moduleSpecifier, opts.filename);
}

function* findPackageJSON(
  filepath: string,
  opts: IResolveOptions
): Generator<any, IFoundPackageJSON, any> {
  let pkg = yield* loadNearestPackageJSON(filepath, opts);
  if (!pkg) {
    pkg = yield* loadNearestPackageJSON('/index', opts);
    if (!pkg) {
      return {
        filepath: '/package.json',
        content: {
          aliases: {},
          hasExports: false,
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
    const aliasedPath = resolveAlias(pkg, f);
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

export function normalizeModuleSpecifier(specifier: string): string {
  const normalized = specifier.replace(/(\/|\\)+/g, '/');
  if (normalized.endsWith('/')) {
    return normalized.substring(0, normalized.length - 1);
  }
  return normalized;
}

const TS_CONFIG_CACHE_KEY = '__root_tsconfig';
function* getTSConfig(
  opts: IResolveOptions
): Generator<any, ProcessedTSConfig | false, any> {
  const cachedConfig = opts.resolverCache.get(TS_CONFIG_CACHE_KEY);
  if (cachedConfig != null) {
    return cachedConfig;
  }

  let config: ProcessedTSConfig | false = false;
  try {
    const contents = yield* opts.readFile('/tsconfig.json');
    const processed = processTSConfig(contents);
    if (processed) {
      config = processed;
    }
  } catch (err) {
    try {
      const contents = yield* opts.readFile('/jsconfig.json');
      const processed = processTSConfig(contents);
      if (processed) {
        config = processed;
      }
    } catch {
      // do nothing
    }
  }
  opts.resolverCache.set(TS_CONFIG_CACHE_KEY, config);
  return config;
}

function* resolve(
  moduleSpecifier: string,
  inputOpts: IResolveOptionsInput,
  skipIndexExpansion: boolean = false
): Generator<any, string, any> {
  const normalizedSpecifier = normalizeModuleSpecifier(moduleSpecifier);
  const opts = normalizeResolverOptions(inputOpts);

  const modulePath = yield* resolveModule(normalizedSpecifier, opts);

  if (modulePath[0] !== '/') {
    // This isn't a node module, we can attempt to resolve using a tsconfig/jsconfig
    if (!opts.filename.includes('/node_modules')) {
      const parsedTSConfig = yield* getTSConfig(opts);
      if (parsedTSConfig) {
        const potentialPaths = getPotentialPathsFromTSConfig(
          modulePath,
          parsedTSConfig
        );
        for (const potentialPath of potentialPaths) {
          try {
            return yield* resolve(potentialPath, opts);
          } catch {
            // do nothing, it's probably a node_module in this case
          }
        }
      }
    }

    try {
      const resolved = yield* resolveNodeModule(modulePath, opts);
      return resolved;
    } catch (e) {
      throw new ModuleNotFoundError(normalizedSpecifier, opts.filename);
    }
  }

  let foundFile = yield* expandFile(modulePath, opts);
  if (!foundFile && !skipIndexExpansion) {
    foundFile = yield* expandFile(pathUtils.join(modulePath, 'index'), opts);

    // In case alias adds an extension, we retry the entire resolution with an added /index
    // This is mostly a hack I guess, but it works for now, so many edge-cases
    if (!foundFile) {
      try {
        const parts = moduleSpecifier.split('/');
        if (!parts.length || !parts[parts.length - 1].startsWith('index')) {
          foundFile = yield* resolve(moduleSpecifier + '/index', opts, true);
        }
      } catch (err) {
        // should throw ModuleNotFound for original specifier, not new one
      }
    }
  }

  if (!foundFile) {
    throw new ModuleNotFoundError(modulePath, opts.filename);
  }

  return foundFile;
}

export const resolver = gensync<
  (
    moduleSpecifier: string,
    inputOpts: IResolveOptionsInput,
    skipIndexExpansion?: boolean
  ) => string
>(resolve);

export const resolveSync = resolver.sync;
export const resolveAsync = resolver.async;
