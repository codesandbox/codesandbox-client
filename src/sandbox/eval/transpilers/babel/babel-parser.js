// @flow
// import loadModule from '../../';

const CUSTOM_BABEL_CONFIG_ENABLED = false;

const DEFAULT_BABEL_CONFIG = {
  presets: ['es2015', 'react', 'stage-0'],
  plugins: [
    'transform-async-to-generator',
    'transform-object-rest-spread',
    'transform-decorators-legacy',
    'transform-class-properties',
    // Polyfills the runtime needed for async/await and generators
    [
      'transform-runtime',
      {
        helpers: false,
        polyfill: false,
        regenerator: true,
      },
    ],
    [
      'transform-regenerator',
      {
        // Async functions are converted to generators by babel-preset-env
        async: false,
      },
    ],
  ],
};

// const resolvePlugin = (plugin: string) => {
//   try {
//     return loadModule(plugin);
//   } catch (e) {
//     return loadModule(`babel-plugin-${plugin}`);
//   }
// };

/**
 * Rewrite the plugin strings to actual dependencies of a babel config
 */
// function rewritePlugins(plugins: ?Array<string | Array<string>>) {
//   if (plugins == null) return [];

//   return plugins.map(dependency => {
//     if (typeof dependency === 'string') {
//       return resolvePlugin(dependency);
//     } else if (Array.isArray(dependency)) {
//       const newDependency = [...dependency];
//       newDependency[0] = resolvePlugin(dependency[0]);

//       return newDependency;
//     }

//     throw new Error(
//       `Could not parse babel plugin: '${JSON.stringify(dependency)}'`,
//     );
//   });
// }

/**
 * Parses the .babelrc if it exists, if it doesn't it will return a default config
 */
export default function getBabelConfig(config: Object = {}, path: string) {
  let resolvedConfig = DEFAULT_BABEL_CONFIG;

  // if (config && CUSTOM_BABEL_CONFIG_ENABLED) {
  //   resolvedConfig = {
  //     ...config,
  //     plugins: rewritePlugins(config.plugins),
  //   };
  // }

  resolvedConfig = {
    ...resolvedConfig,
    plugins: config.plugins ? config.plugins : resolvedConfig.plugins,
    presets: config.presets ? config.presets : resolvedConfig.presets,
    sourceMaps: 'inline',
    sourceFileName: path,
    sourceMapTarget: `${path}:transpiled`,
  };

  return resolvedConfig;
}
