// @flow
import type { Module, Directory } from 'common/types';

import asyncPlugin from 'babel-plugin-transform-async-to-generator';
import restSpreadPlugin from 'babel-plugin-transform-object-rest-spread';
import classPropertiesPlugin from 'babel-plugin-transform-class-properties';
import decoratorsPlugin from 'babel-plugin-transform-decorators-legacy';
import dynamicImportPlugin from 'babel-plugin-dynamic-import-node';

import evalModule from '../';
import resolveDependency from './dependency-resolver';

const CUSTOM_BABEL_CONFIG_ENABLED = false;

const DEFAULT_BABEL_CONFIG = {
  presets: ['es2015', 'react', 'stage-0'],
  plugins: [
    decoratorsPlugin,
    asyncPlugin,
    restSpreadPlugin,
    classPropertiesPlugin,
    dynamicImportPlugin,
  ],
  retainLines: true,
};

const resolvePlugin = (plugin: string, externals) => {
  try {
    return resolveDependency(plugin, externals);
  } catch (e) {
    return resolveDependency(`babel-plugin-${plugin}`, externals);
  }
};

/**
 * Rewrite the plugin strings to actual dependencies of a babel config
 */
function rewritePlugins(plugins: ?Array<string>, externals) {
  if (plugins == null) return [];

  return plugins.map(dependency => {
    if (typeof dependency === 'string') {
      return resolvePlugin(dependency, externals);
    } else if (Array.isArray(dependency)) {
      const newDependency = [...dependency];
      newDependency[0] = resolvePlugin(dependency[0], externals);

      return newDependency;
    }

    throw new Error(
      `Could not parse babel plugin: '${JSON.stringify(dependency)}'`,
    );
  });
}

/**
 * Parses the .babelrc if it exists, if it doesn't it will return a default config
 */
export default function getBabelConfig(
  currentModule: Module,
  modules: Array<Module>,
  directories: Array<Directory>,
  externals: Object,
  depth: ?number,
) {
  const babelConfigModule = modules.find(
    m => m.title === '.babelrc' && !m.directoryShortid,
  );

  if (
    babelConfigModule &&
    babelConfigModule !== currentModule &&
    CUSTOM_BABEL_CONFIG_ENABLED
  ) {
    const config = evalModule(
      babelConfigModule,
      modules,
      directories,
      externals,
      depth,
    );

    const resolvedConfig = {
      ...config,
      plugins: rewritePlugins(config.plugins, externals),
      retainLines: true,
    };

    return resolvedConfig;
  }

  return DEFAULT_BABEL_CONFIG;
}
