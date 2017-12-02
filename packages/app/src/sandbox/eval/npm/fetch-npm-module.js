// @flow
import * as pathUtils from 'common/utils/path';
import resolve from 'browser-resolve';

import type { Module } from '../entities/module';
import Manager, { Manifest } from '../manager';

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

function normalize(depName: string, files: MetaFiles, fileObject: Meta = {}) {
  for (let i = 0; i < files.length; i += 1) {
    if (files[i].type === 'file') {
      const absolutePath = pathUtils.join(
        '/node_modules',
        depName,
        files[i].path
      );
      fileObject[absolutePath] = true; // eslint-disable-line no-param-reassign
    }

    if (files[i].files) {
      normalize(depName, files[i].files, fileObject);
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
    .then(x => x.json())
    .then(metaInfo => normalize(name, metaInfo.files))
    .then(normalizedMetas => {
      combinedMetas = { ...combinedMetas, ...normalizedMetas };
      return normalizedMetas;
    });

  return metas[id];
}

function downloadDependency(depName: string, depVersion: string, path: string) {
  if (packages[path]) {
    return packages[path];
  }

  const relativePath = path.replace(
    pathUtils.join('/node_modules', depName),
    ''
  );

  packages[path] = window
    .fetch(`https://unpkg.com/${depName}@${depVersion}${relativePath}`)
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

function findDependencyVersion(manifest: Manifest, dependencyName: string) {
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
    return version;
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

  const version = findDependencyVersion(manager.manifest, dependencyName);

  if (!version) {
    throw new DependencyNotFoundError(path);
  }

  const meta = await getMeta(dependencyName, version);

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
        isFile: (p, c) => c(null, !!manager.transpiledModules[p] || !!meta[p]),
        readFile: async (p, c, cb) => {
          const callback = cb || c;
          if (manager.transpiledModules[p]) {
            return callback(null, manager.transpiledModules[p].module.code);
          }

          const depPath = p.replace('/node_modules/', '');
          const depName = getDependencyName(depPath);

          const subDepVersion = findDependencyVersion(
            manager.manifest,
            depName
          );

          if (subDepVersion) {
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

        if (resolvedPath === '//empty.js') {
          return res({
            path: '//empty.js',
            code: 'module.exports = {};',
            requires: [],
          });
        }

        return res(downloadDependency(dependencyName, version, resolvedPath));
      }
    );
  });
}
