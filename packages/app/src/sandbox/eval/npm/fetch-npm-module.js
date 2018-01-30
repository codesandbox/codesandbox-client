// @flow
import * as pathUtils from 'common/utils/path';
import resolve from 'browser-resolve';

import type { Module } from '../entities/module';
import Manager from '../manager';
import type { Manifest } from '../manager';

import DependencyNotFoundError from '../../errors/dependency-not-found-error';
import getDependencyName from '../utils/get-dependency-name';

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

function getMeta(name: string, version: string) {
  const id = `${name}@${version}`;
  if (metas[id]) {
    return metas[id];
  }

  metas[id] = window
    .fetch(`https://unpkg.com/${name}@${version}/?meta`)
    .then(x => x.json());

  return metas[id];
}

function downloadDependency(depName: string, depVersion: string, path: string) {
  if (packages[path]) {
    return packages[path];
  }

  const relativePath = path.replace(
    new RegExp(
      `.*${pathUtils.join('/node_modules', depName)}`.replace('/', '\\/')
    ),
    ''
  );

  const isGitHub = /\//.test(depVersion);
  const url = isGitHub
    ? `https://cdn.jsdelivr.net/gh/${depVersion}${relativePath}`
    : `https://unpkg.com/${depName}@${depVersion}${relativePath}`;

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
    }));

  return packages[path];
}

function resolvePath(
  path: string,
  currentPath: string,
  manager: Manager,
  defaultExtensions: Array<string> = ['js', 'jsx', 'json'],
  meta = {}
): Promise<string> {
  return new Promise((res, reject) => {
    resolve(
      path,
      {
        filename: currentPath,
        extensions: defaultExtensions.map(ext => '.' + ext),
        moduleDirectory: [
          'node_modules',
          manager.envVariables.NODE_PATH,
        ].filter(x => x),
        isFile: (p, c, cb) => {
          const callback = cb || c;

          callback(null, !!manager.transpiledModules[p] || !!meta[p]);
        },
        readFile: async (p, c, cb) => {
          const callback = cb || c;

          if (manager.transpiledModules[p]) {
            return callback(null, manager.transpiledModules[p].module.code);
          }

          const depPath = p.replace('/node_modules/', '');
          const depName = getDependencyName(depPath);

          // We don't try to download package.json, because we can assume that
          // all package.json files have been included in the bundle sent by
          // the packager.
          if (depPath.endsWith('package.json')) {
            const err = new Error('Could not find ' + p);
            err.code = 'ENOENT';

            callback(err);
            return null;
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

                callback(null, module.code);
                return null;
              }
            } catch (e) {
              // Let it throw the error
            }
          }

          const err = new Error('Could not find ' + p);
          err.code = 'ENOENT';

          callback(err);
          return null;
        },
      },
      (err, resolvedPath) => {
        if (err) {
          console.error(err);
          return reject(err);
        }

        return res(resolvedPath);
      }
    );
  });
}

async function findDependencyVersion(
  currentPath: string,
  manager: Manager,
  defaultExtensions: Array<string> = ['js', 'jsx', 'json'],
  dependencyName: string
) {
  const manifest = manager.manifest;

  try {
    const foundPackageJSONPath = await resolvePath(
      pathUtils.join(dependencyName, 'package.json'),
      currentPath,
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
  currentPath: string,
  manager: Manager,
  defaultExtensions: Array<string> = ['js', 'jsx', 'json']
): Promise<Module> {
  const dependencyName = getDependencyName(path);

  const versionInfo = await findDependencyVersion(
    currentPath,
    manager,
    defaultExtensions,
    dependencyName
  );

  if (!versionInfo) {
    throw new DependencyNotFoundError(path);
  }

  const { packageJSONPath, version } = versionInfo;

  const meta = await getMeta(dependencyName, version);

  const normalizedMeta = normalize(
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
    currentPath,
    manager,
    defaultExtensions,
    normalizedMeta
  );

  if (foundPath === '//empty.js') {
    return {
      path: '//empty.js',
      code: 'module.exports = {};',
      requires: [],
    };
  }

  return downloadDependency(dependencyName, version, foundPath);
}
