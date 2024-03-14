import * as pathUtils from '@codesandbox/common/lib/utils/path';
import gensync from 'gensync';
import DependencyNotFoundError from 'sandbox-hooks/errors/dependency-not-found-error';

import { Module } from '../../types/module';
import Manager from '../../manager';

import { getFetchProtocol } from './fetch-protocols';
import { getDependencyName } from '../../utils/get-dependency-name';
import { TranspiledModule } from '../../transpiled-module';
import { DEFAULT_EXTENSIONS } from '../../utils/extensions';
import {
  invalidatePackageFromCache,
  resolveAsync,
} from '../../resolver/resolver';

export type Meta = {
  [path: string]: true;
};

// dependencyAndVersion => P<Meta>
const metas = new Map<string, Promise<Meta>>();
export let combinedMetas: Meta = {}; // eslint-disable-line
const normalizedMetas: { [key: string]: Meta } = {};

// path => P<Module>
const packages = new Map<string, Promise<Module>>();

function prependRootPath(meta: Meta, rootPath: string): Meta {
  const newMeta: Meta = {};
  Object.keys(meta).forEach(path => {
    newMeta[rootPath + path] = meta[path];
  });

  return newMeta;
}

export interface FetchProtocol {
  file(name: string, version: string, path: string): Promise<string>;
  meta(name: string, version: string): Promise<Meta>;
  massFiles?(name: string, version: string): Promise<Array<Module>>;
}

export function setCombinedMetas(givenCombinedMetas: Meta) {
  combinedMetas = givenCombinedMetas;
}

// Strips the version of a path, eg. test/1.3.0 -> test
const ALIAS_REGEX = /\/\d*\.\d*\.\d*.*?(\/|$)/;

/*
 * Resolve name and version from npm aliases
 * e.g. "react": "npm:preact-compat@16.0.0"
 */
const resolveNPMAlias = (name: string, version: string): string[] => {
  const IS_ALIAS = /^npm:/;

  if (!version.match(IS_ALIAS)) {
    return [name, version];
  }

  const parts = version.match(/^npm:(.+)@(.+)/)!;
  return [parts[1]!, parts[2]!];
};

function getMeta(
  name: string,
  packageJSONPath: string | null,
  version: string,
  useFallback = false
): Promise<{ meta: Meta; fromCache: boolean }> {
  const [depName, depVersion] = resolveNPMAlias(name, version);
  const nameWithoutAlias = depName.replace(ALIAS_REGEX, '');
  const id = `${packageJSONPath || depName}@${depVersion}`;
  const foundMeta = metas.get(id);
  if (foundMeta) {
    return foundMeta.then(x => ({
      meta: x,
      fromCache: true,
    }));
  }

  const protocol = getFetchProtocol(depName, depVersion, useFallback);

  const newMeta = protocol.meta(nameWithoutAlias, depVersion).catch(e => {
    metas.delete(id);
    throw e;
  });
  metas.set(id, newMeta);
  return newMeta.then(x => ({
    meta: x,
    fromCache: false,
  }));
}

const downloadedAllDependencies = new Set<string>();
/**
 * If the protocol supports it, download all files of the dependency
 * at once. It's an optimization.
 */
export async function downloadAllDependencyFiles(
  name: string,
  version: string
): Promise<Module[] | null> {
  if (downloadedAllDependencies.has(`${name}@${version}`)) {
    return null;
  }

  downloadedAllDependencies.add(`${name}@${version}`);

  const [depName, depVersion] = resolveNPMAlias(name, version);
  const nameWithoutAlias = depName.replace(ALIAS_REGEX, '');
  const protocol = getFetchProtocol(depName, depVersion);

  if (protocol.massFiles) {
    // If the protocol supports returning many files at once, we opt for that instead.
    return protocol.massFiles(nameWithoutAlias, depVersion);
  }

  return null;
}

const packagesToInvalidate = new Set<string>();
function invalidatePendingPackages(manager: Manager) {
  for (const pkgName of packagesToInvalidate) {
    invalidatePackageFromCache(pkgName, manager.resolverCache);
    packagesToInvalidate.delete(pkgName);
  }
}

export function downloadDependency(
  name: string,
  version: string,
  path: string
): Promise<Module> {
  const [depName, depVersion] = resolveNPMAlias(name, version);
  const id = depName + depVersion + path;
  const foundPkg = packages.get(id);
  if (foundPkg) {
    return foundPkg;
  }

  packagesToInvalidate.add(depName);

  const relativePath = path
    .replace(
      new RegExp(
        `.*${pathUtils.join('/node_modules', depName)}`.replace('/', '\\/')
      ),
      ''
    )
    .replace(/#/g, '%23');

  const nameWithoutAlias = depName.replace(ALIAS_REGEX, '');
  const protocol = getFetchProtocol(depName, depVersion);

  const newPkg = protocol
    .file(nameWithoutAlias, depVersion, relativePath)
    .catch(async () => {
      const fallbackProtocol = getFetchProtocol(
        nameWithoutAlias,
        depVersion,
        true
      );
      return fallbackProtocol.file(nameWithoutAlias, depVersion, relativePath);
    })
    .then(code => ({
      path,
      code,
      downloaded: true,
    }));
  packages.set(id, newPkg);
  return newPkg;
}

function resolvePath(
  path: string,
  currentTModule: TranspiledModule,
  manager: Manager,
  defaultExtensions: Array<string> = DEFAULT_EXTENSIONS,
  meta: Meta = {},
  ignoreDepNameVersion: string = ''
): Promise<string> {
  invalidatePendingPackages(manager);

  const currentPath = currentTModule.module.path;

  const isFile = gensync({
    sync: (p: string) =>
      Boolean(manager.transpiledModules[p]) || Boolean(meta[p]),
  });

  const readFile = gensync({
    sync: () => {
      throw new Error('Sync not supported for readFile');
    },
    async: async (p: string): Promise<string> => {
      try {
        const tModule = await manager.resolveTranspiledModule(p, '/', []);
        tModule.initiators.add(currentTModule);
        currentTModule.dependencies.add(tModule);
        return tModule.module.code;
      } catch (e) {
        const depPath = p.replace(/.*\/node_modules\//, '');
        const depName = getDependencyName(depPath);

        // To prevent infinite loops we keep track of which dependencies have been requested before.
        if (
          (!manager.transpiledModules[p] && !meta[p]) ||
          ignoreDepNameVersion === depName
        ) {
          const err = new Error('Could not find ' + p);
          // @ts-ignore
          err.code = 'ENOENT';

          throw err;
        }

        // eslint-disable-next-line
        const subDepVersionVersionInfo = await getDependencyVersion(
          currentTModule,
          manager,
          depName
        );

        if (subDepVersionVersionInfo) {
          const { version: subDepVersion } = subDepVersionVersionInfo;
          try {
            const module = await downloadDependency(
              depName,
              subDepVersion,
              p
            ).finally(() => {
              packagesToInvalidate.add(depName);
              invalidatePendingPackages(manager);
            });

            if (module) {
              manager.addModule(module);
              const tModule = manager.addTranspiledModule(module, '');

              tModule.initiators.add(currentTModule);
              currentTModule.dependencies.add(tModule);

              return module.code;
            }
          } catch (er) {
            // Let it throw the error
          }
        }

        throw e;
      }
    },
  });

  return resolveAsync(path, {
    resolverCache: manager.resolverCache,
    filename: currentPath,
    extensions: defaultExtensions.map(ext => '.' + ext),
    moduleDirectories: ['node_modules', manager.envVariables.NODE_PATH].filter(
      Boolean
    ),
    isFile,
    readFile,
  });
}

type DependencyVersionResult =
  | {
      version: string;
      packageJSONPath: string;
    }
  | {
      version: string;
      packageJSONPath: null;
    }
  | {
      version: string;
      name: string | null;
      packageJSONPath: null;
    };

async function getDependencyVersion(
  currentTModule: TranspiledModule,
  manager: Manager,
  dependencyName: string
): Promise<DependencyVersionResult | null> {
  const { manifest } = manager;

  try {
    const filepath = pathUtils.join(dependencyName, 'package.json');
    const foundPackageJSONPath = await resolvePath(
      filepath,
      currentTModule,
      manager,
      [],
      {},
      dependencyName
    );

    // If the dependency is in the root we get it from the manifest, as the manifest
    // contains all the versions that we really wanted to resolve in the first place.
    // An example of this is csb.dev packages, the package.json version doesn't say the
    // actual version, but the semver it relates to. In this case we really want to have
    // the actual url
    if (
      foundPackageJSONPath ===
      pathUtils.join('/node_modules', dependencyName, 'package.json')
    ) {
      const rootDependency = manifest.dependencies.find(
        dep => dep.name === dependencyName
      );
      if (rootDependency) {
        return {
          packageJSONPath: foundPackageJSONPath,
          version: rootDependency.version,
        };
      }
    }

    const packageJSON =
      manager.transpiledModules[foundPackageJSONPath] &&
      manager.transpiledModules[foundPackageJSONPath].module.code;
    const { version } = JSON.parse(packageJSON);

    const savedDepDep = manifest.dependencyDependencies[dependencyName];

    if (
      savedDepDep &&
      savedDepDep.resolved === version &&
      savedDepDep.semver.startsWith('https://')
    ) {
      return {
        packageJSONPath: foundPackageJSONPath,
        version: savedDepDep.semver,
      };
    }

    if (packageJSON !== '//empty.js') {
      return { packageJSONPath: foundPackageJSONPath, version };
    }
  } catch (e) {
    /* do nothing */
  }

  let version = null;

  if (manifest.dependencyDependencies[dependencyName]) {
    if (
      manifest.dependencyDependencies[dependencyName].semver.startsWith(
        'https://'
      )
    ) {
      version = manifest.dependencyDependencies[dependencyName].semver;
    } else {
      version = manifest.dependencyDependencies[dependencyName].resolved;
    }
  } else {
    const dep = manifest.dependencies.find(m => m.name === dependencyName);

    if (dep) {
      // eslint-disable-next-line
      version = dep.version;
    }
  }

  if (version) {
    return { packageJSONPath: null, version };
  }

  return null;
}

export async function fetchModule(
  path: string,
  currentTModule: TranspiledModule,
  manager: Manager,
  defaultExtensions: Array<string> = DEFAULT_EXTENSIONS
): Promise<Module> {
  const currentPath = currentTModule.module.path;

  // Get the last part of the path as dependency name for paths like
  // instantsearch.js/node_modules/lodash/sum.js
  // In this case we want to get the lodash dependency info
  const dependencyName = getDependencyName(
    path.replace(/.*\/node_modules\//, '')
  );

  packagesToInvalidate.add(dependencyName);
  invalidatePendingPackages(manager);

  const versionInfo = await getDependencyVersion(
    currentTModule,
    manager,
    dependencyName
  );

  if (versionInfo === null) {
    throw new DependencyNotFoundError(path);
  }

  const { packageJSONPath, version } = versionInfo;

  let meta: { meta: Meta; fromCache: boolean };

  try {
    meta = await getMeta(dependencyName, packageJSONPath, version);
  } catch (e) {
    // Use fallback
    meta = await getMeta(dependencyName, packageJSONPath, version, true);
  }

  const rootPath = packageJSONPath
    ? pathUtils.dirname(packageJSONPath)
    : pathUtils.join('/node_modules', dependencyName);
  const normalizedCacheKey = dependencyName + rootPath;

  const normalizedMeta =
    normalizedMetas[normalizedCacheKey] || prependRootPath(meta.meta, rootPath);

  if (!normalizedMetas[normalizedCacheKey]) {
    normalizedMetas[normalizedCacheKey] = normalizedMeta;
  } else if (!meta.fromCache) {
    combinedMetas = { ...combinedMetas, ...normalizedMeta };
  }

  packagesToInvalidate.add(dependencyName);
  invalidatePendingPackages(manager);

  const foundPath = await resolvePath(
    path,
    currentTModule,
    manager,
    defaultExtensions,
    normalizedMeta
  );

  if (foundPath === '//empty.js') {
    // Mark the path of the module as the real module, because during evaluation
    // we don't have meta to find which modules are browser modules and we still
    // need to return an empty module for browser modules.
    const isDependency = /^(\w|@\w|@-)/.test(path);
    const fullFilePath = isDependency
      ? pathUtils.join('/node_modules', path)
      : pathUtils.join(currentPath, path);

    return {
      path: fullFilePath,
      code: 'module.exports = {};',
      requires: [],
      stubbed: true,
    };
  }

  return downloadDependency(dependencyName, version, foundPath).finally(() => {
    packagesToInvalidate.add(dependencyName);
    invalidatePendingPackages(manager);
  });
}
