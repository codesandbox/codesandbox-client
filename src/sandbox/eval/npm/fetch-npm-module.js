// @flow
import * as pathUtils from 'common/utils/path';

import type { Module } from '../entities/module';
import type { Manifest } from '../manager';

import DependencyNotFoundError from '../../errors/dependency-not-found-error';
import ModuleNotFoundError from '../../errors/module-not-found-error';
import nodeResolvePath from '../utils/node-resolve-path';

type Meta = {
  [path: string]: any,
};
type Metas = {
  [dependencyAndVersion: string]: Meta,
};

type MetaFiles = Array<{ path: string, files?: MetaFiles }>;

const metas: Metas = {};

function normalize(files: MetaFiles, fileObject: Meta = {}) {
  for (let i = 0; i < files.length; i += 1) {
    fileObject[files[i].path] = true; // eslint-disable-line no-param-reassign

    if (files[i].files) {
      normalize(files[i].files, fileObject);
    }
  }

  return fileObject;
}

function getMeta(name: string, version: string) {
  if (metas[`${name}@${version}`]) {
    return metas[`${name}@${version}`];
  }

  return window
    .fetch(`https://unpkg.com/${name}@${version}/?meta`)
    .then(x => x.json())
    .then(metaInfo => {
      const normalizedMetaInfo = normalize(metaInfo.files);
      // rewrite to path: any object
      metas[`${name}@${version}`] = normalizedMetaInfo;

      return normalizedMetaInfo;
    });
}

export default async function fetchModule(
  path: string,
  manifest: Manifest,
  defaultExtensions: Array<string> = ['js', 'jsx', 'json']
): Promise<Module> {
  const installedDependencies = {
    ...manifest.dependencies.reduce(
      (t, n) => ({ ...t, [n.name]: n.version }),
      {}
    ),
    ...manifest.dependencyDependencies,
  };

  const dependencyParts = path.split('/');
  const dependencyName = path.startsWith('@')
    ? `${dependencyParts[0]}/${dependencyParts[1]}`
    : dependencyParts[0];

  const version = installedDependencies[dependencyName];

  if (!version) {
    throw new DependencyNotFoundError(path);
  }

  const meta = await getMeta(dependencyName, version);

  const resolvedPath = nodeResolvePath(
    path.replace(dependencyName, ''),
    meta,
    defaultExtensions
  );

  return window
    .fetch(`https://unpkg.com/${dependencyName}@${version}${resolvedPath}`)
    .then(x => {
      if (x.ok) {
        return x.text();
      }

      return `throw new Error("Could not find module ${path}`;
    })
    .then(x => ({
      path: pathUtils.join('/node_modules', dependencyName, resolvedPath),
      code: x,
    }));
}
