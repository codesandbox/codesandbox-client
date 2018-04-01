// @flow

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

/**
 * Parses the .babelrc if it exists, if it doesn't it will return a default config
 */
export default function getBabelConfig(
  config: ?Object,
  loaderOptions: Object,
  path: string
) {
  const resolvedConfig = config || DEFAULT_BABEL_CONFIG;

  if (loaderOptions.disableCodeSandboxPlugins) {
    return resolvedConfig;
  }

  return {
    ...resolvedConfig,
    sourceMaps: 'inline',
    sourceFileName: path,
    filename: path,
  };
}
