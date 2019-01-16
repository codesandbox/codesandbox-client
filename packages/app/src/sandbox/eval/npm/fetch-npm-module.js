// @flow
import * as pathUtils from 'common/utils/path';
import resolve from 'browser-resolve';
import DependencyNotFoundError from 'sandbox-hooks/errors/dependency-not-found-error';

import type { Module } from '../entities/module';
import Manager from '../manager';
import type { Manifest } from '../manager';

import getDependencyName from '../utils/get-dependency-name';
import { packageFilter } from '../utils/resolve-utils';
import type { default as TranspiledModule } from '../transpiled-module';

type Meta = {
  [path: string]: any,
};
type Metas = {
  [dependencyAndVersion: string]: Meta,
};

type Packages = {
  [path: string]: Object,
};

type MetaFiles = Array<{ path: string, files?: MetaFiles }>;

const metas: Metas = {};
let combinedMetas: Meta = {};
const packages: Packages = {};

export function getCombinedMetas() {
  return combinedMetas;
}

export function setCombinedMetas(givenCombinedMetas: Meta) {
  combinedMetas = givenCombinedMetas;
}

function normalize(
  depName: string,
  files: MetaFiles,
  fileObject: Meta = {},
  rootPath: string
) {
  for (let i = 0; i < files.length; i += 1) {
    if (files[i].type === 'file') {
      const absolutePath = pathUtils.join(rootPath, files[i].path);
      fileObject[absolutePath] = true; // eslint-disable-line no-param-reassign
    }

    if (files[i].files) {
      normalize(depName, files[i].files, fileObject, rootPath);
    }
  }

  return fileObject;
}

function normalizeJSDelivr(
  depName: string,
  files: any,
  fileObject: Meta = {},
  rootPath
) {
  for (let i = 0; i < files.length; i += 1) {
    const absolutePath = pathUtils.join(rootPath, files[i].name);
    fileObject[absolutePath] = true; // eslint-disable-line no-param-reassign
  }

  return fileObject;
}

const TEMP_USE_JSDELIVR = false;

function getUnpkgUrl(name: string, version: string) {
  const nameWithoutAlias = name.replace(/\/\d*\.\d*\.\d*$/, '');

  return TEMP_USE_JSDELIVR
    ? `https://cdn.jsdelivr.net/npm/${nameWithoutAlias}@${version}`
    : `https://unpkg.com/${nameWithoutAlias}@${version}`;
}

function getMeta(name: string, packageJSONPath: string, version: string) {
  const nameWithoutAlias = name.replace(/\/\d*\.\d*\.\d*$/, '');
  const id = `${packageJSONPath}@${version}`;
  if (metas[id]) {
    return metas[id];
  }

  metas[id] = window
    .fetch(
      TEMP_USE_JSDELIVR
        ? `https://data.jsdelivr.com/v1/package/npm/${nameWithoutAlias}@${version}/flat`
        : `https://unpkg.com/${nameWithoutAlias}@${version}/?meta`
    )
    .then(x => x.json());

  return metas[id];
}

function downloadDependency(depName: string, depVersion: string, path: string) {
  if (packages[path]) {
    return packages[path];
  }

  const relativePath = path
    .replace(
      new RegExp(
        `.*${pathUtils.join('/node_modules', depName)}`.replace('/', '\\/')
      ),
      ''
    )
    .replace(/#/g, '%23');
  const isGitHub = /\//.test(depVersion);

  const url = isGitHub
    ? `https://cdn.jsdelivr.net/gh/${depVersion}${relativePath}`
    : `${getUnpkgUrl(depName, depVersion)}${relativePath}`;

  packages[path] = window
    .fetch(url)
    .then(x => {
      if (x.ok) {
        return x.text();
      }

      throw new Error(`Could not find module ${path}`);
    })
    .then(x => ({
      path,
      code: x,
      downloaded: true,
    }));

  return packages[path];
}

function resolvePath(
  path: string,
  currentTModule: TranspiledModule,
  manager: Manager,
  defaultExtensions: Array<string> = ['js', 'jsx', 'json'],
  meta = {}
): Promise<string> {
  const currentPath = currentTModule.module.path;

  return new Promise((res, reject) => {
    resolve(
      path,
      {
        filename: currentPath,
        extensions: defaultExtensions.map(ext => '.' + ext),
        packageFilter,
        moduleDirectory: [
          'node_modules',
          manager.envVariables.NODE_PATH,
        ].filter(Boolean),
        isFile: (p, c, cb) => {
          const callback = cb || c;

          callback(null, !!manager.transpiledModules[p] || !!meta[p]);
        },
        readFile: async (p, c, cb) => {
          const callback = cb || c;

          try {
            const tModule = manager.resolveTranspiledModule(p, '/');
            tModule.initiators.add(currentTModule);
            currentTModule.dependencies.add(tModule);
            return callback(null, tModule.module.code);
          } catch (e) {
            const depPath = p.replace('/node_modules/', '');
            const depName = getDependencyName(depPath);

            // To prevent infinite loops we keep track of which dependencies have been requested before.
            if (!manager.transpiledModules[p] && !meta[p]) {
              const err = new Error('Could not find ' + p);
              err.code = 'ENOENT';

              return callback(err);
            }

            // eslint-disable-next-line
            const subDepVersionVersionInfo = await findDependencyVersion(
              currentPath,
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
      (err, resolvedPath) => {
        if (err) {
          return reject(err);
        }

        return res(resolvedPath);
      }
    );
  });
}

async function findDependencyVersion(
  currentTModule: TranspiledModule,
  manager: Manager,
  defaultExtensions: Array<string> = ['js', 'jsx', 'json'],
  dependencyName: string
) {
  const manifest = manager.manifest;

  try {
    const foundPackageJSONPath = await resolvePath(
      pathUtils.join(dependencyName, 'package.json'),
      currentTModule,
      manager,
      defaultExtensions
    );

    const packageJSON =
      manager.transpiledModules[foundPackageJSONPath] &&
      manager.transpiledModules[foundPackageJSONPath].module.code;
    const { version } = JSON.parse(packageJSON);

    if (packageJSON !== '//empty.js') {
      return { packageJSONPath: foundPackageJSONPath, version };
    }
  } catch (e) {
    /* do nothing */
  }

  let version = null;

  if (manifest.dependencyDependencies[dependencyName]) {
    version = manifest.dependencyDependencies[dependencyName].resolved;
  } else {
    const dep = manifest.dependencies.find(m => m.name === dependencyName);

    if (dep) {
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
  defaultExtensions: Array<string> = ['js', 'jsx', 'json']
): Promise<Module> {
  const currentPath = currentTModule.module.path;
  // Get the last part of the path as dependency name for paths like
  // instantsearch.js/node_modules/lodash/sum.js
  // In this case we want to get the lodash dependency info
  const dependencyName = getDependencyName(
    path.replace(/.*\/node_modules\//, '')
  );

  const versionInfo = await findDependencyVersion(
    currentTModule,
    manager,
    defaultExtensions,
    dependencyName
  );

  if (!versionInfo) {
    throw new DependencyNotFoundError(path);
  }

  const { packageJSONPath, version } = versionInfo;

  const meta = await getMeta(dependencyName, packageJSONPath, version);

  const normalizeFunction = TEMP_USE_JSDELIVR ? normalizeJSDelivr : normalize;
  const normalizedMeta = normalizeFunction(
    dependencyName,
    meta.files,
    {},
    packageJSONPath
      ? pathUtils.dirname(packageJSONPath)
      : pathUtils.join('/node_modules', dependencyName)
  );
  combinedMetas = { ...combinedMetas, ...normalizedMeta };

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
    const isDependency = /^(\w|@\w)/.test(path);

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
