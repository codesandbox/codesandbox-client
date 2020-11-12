import * as pathUtils from '@codesandbox/common/lib/utils/path';
import resolve from 'browser-resolve';
import DependencyNotFoundError from 'sandbox-hooks/errors/dependency-not-found-error';

import { Module } from '../../types/module';
import Manager, { ReadFileCallback } from '../../manager';

import { getFetchProtocol } from './fetch-protocols';
import { getDependencyName } from '../../utils/get-dependency-name';
import { packageFilter } from '../../utils/resolve-utils';
import { TranspiledModule } from '../../transpiled-module';
import { DEFAULT_EXTENSIONS } from '../../utils/extensions';

export type Meta = {
  [path: string]: true;
};
type Metas = {
  [dependencyAndVersion: string]: Promise<Meta>;
};

type Packages = {
  [path: string]: Promise<Module>;
};

const metas: Metas = {};
export let combinedMetas: Meta = {}; // eslint-disable-line
const normalizedMetas: { [key: string]: Meta } = {};
const packages: Packages = {};

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
}

export function setCombinedMetas(givenCombinedMetas: Meta) {
  combinedMetas = givenCombinedMetas;
}

// Strips the version of a path, eg. test/1.3.0 -> test
const ALIAS_REGEX = /\/\d*\.\d*\.\d*.*?(\/|$)/;

/*
 * Resolve name and version from npm aliases
 * e.g. "my-react": "npm:react@16.0.0
 */
const resolveNPMAlias = (name: string, version: string): string[] => {
  const IS_ALIAS = /^npm:/;

  if (!version.match(IS_ALIAS)) {
    return [name, version];
  }

  const parts = version.match(/^npm:(.+)@(.+)/)!;
  return [parts[1]!, parts[2]!];
};

async function getMeta(
  name: string,
  packageJSONPath: string | null,
  version: string,
  useFallback = false
) {
  const [depName, depVersion] = resolveNPMAlias(name, version);
  const nameWithoutAlias = depName.replace(ALIAS_REGEX, '');
  const id = `${packageJSONPath || depName}@${depVersion}`;
  if (metas[id]) {
    return metas[id];
  }

  const protocol = getFetchProtocol(depName, depVersion, useFallback);

  metas[id] = protocol.meta(nameWithoutAlias, depVersion).catch(e => {
    delete metas[id];

    throw e;
  });

  return metas[id];
}

export async function downloadDependency(
  name: string,
  version: string,
  path: string
): Promise<Module> {
  const [depName, depVersion] = resolveNPMAlias(name, version);
  const id = depName + depVersion + path;
  if (packages[id]) {
    return packages[id];
  }

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

  packages[id] = protocol
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

  return packages[id];
}

function resolvePath(
  path: string,
  currentTModule: TranspiledModule,
  manager: Manager,
  defaultExtensions: Array<string> = DEFAULT_EXTENSIONS,
  meta: Meta = {}
): Promise<string> {
  const currentPath = currentTModule.module.path;

  const isFile = (p: string, c?: any, cb?: any): any => {
    const callback = cb || c;

    const result = Boolean(manager.transpiledModules[p]) || Boolean(meta[p]);
    if (!callback) {
      return result;
    }

    return callback(null, result);
  };

  return new Promise((res, reject) => {
    resolve(
      path,
      {
        filename: currentPath,
        extensions: defaultExtensions.map(ext => '.' + ext),
        packageFilter: packageFilter(isFile),
        moduleDirectory: [
          'node_modules',
          manager.envVariables.NODE_PATH,
        ].filter(Boolean),
        isFile,
        // @ts-ignore
        readFile: async (
          p: string,
          c: ReadFileCallback,
          cb: ReadFileCallback
        ) => {
          const callback = cb || c;

          try {
            const tModule = manager.resolveTranspiledModule(p, '/');
            tModule.initiators.add(currentTModule);
            currentTModule.dependencies.add(tModule);
            return callback(null, tModule.module.code);
          } catch (e) {
            const depPath = p.replace(/.*\/node_modules\//, '');
            const depName = getDependencyName(depPath);

            // To prevent infinite loops we keep track of which dependencies have been requested before.
            if (!manager.transpiledModules[p] && !meta[p]) {
              const err = new Error('Could not find ' + p);
              // @ts-ignore
              err.code = 'ENOENT';

              return callback(err);
            }

            // eslint-disable-next-line
            const subDepVersionVersionInfo = await getDependencyVersion(
              currentTModule,
              manager,
              defaultExtensions,
              depName
            );

            if (subDepVersionVersionInfo) {
              const { version: subDepVersion } = subDepVersionVersionInfo;
              try {
                const module = await downloadDependency(
                  depName,
                  subDepVersion,
                  p
                );

                if (module) {
                  manager.addModule(module);
                  const tModule = manager.addTranspiledModule(module, '');

                  tModule.initiators.add(currentTModule);
                  currentTModule.dependencies.add(tModule);

                  callback(null, module.code);
                  return null;
                }
              } catch (er) {
                // Let it throw the error
              }
            }

            return callback(e);
          }
        },
      },
      (err: Error | undefined, resolvedPath: string) => {
        if (err) {
          return reject(err);
        }

        return res(resolvedPath);
      }
    );
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
  defaultExtensions: string[] = DEFAULT_EXTENSIONS,
  dependencyName: string
): Promise<DependencyVersionResult | null> {
  const { manifest } = manager;

  try {
    const foundPackageJSONPath = await resolvePath(
      pathUtils.join(dependencyName, 'package.json'),
      currentTModule,
      manager,
      defaultExtensions
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

export default async function fetchModule(
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

  const versionInfo = await getDependencyVersion(
    currentTModule,
    manager,
    defaultExtensions,
    dependencyName
  );

  if (versionInfo === null) {
    throw new DependencyNotFoundError(path);
  }

  const { packageJSONPath, version } = versionInfo;

  let meta: Meta;

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
    normalizedMetas[normalizedCacheKey] || prependRootPath(meta, rootPath);

  if (!normalizedMetas[normalizedCacheKey]) {
    normalizedMetas[normalizedCacheKey] = normalizedMeta;
  } else {
    combinedMetas = { ...combinedMetas, ...normalizedMeta };
  }

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

    return {
      path: isDependency
        ? pathUtils.join('/node_modules', path)
        : pathUtils.join(currentPath, path),
      code: 'module.exports = {};',
      requires: [],
      stubbed: true,
    };
  }

  return downloadDependency(dependencyName, version, foundPath);
}
