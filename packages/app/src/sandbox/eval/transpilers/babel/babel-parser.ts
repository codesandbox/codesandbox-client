const DEFAULT_BABEL_CONFIG = {
  presets: ['env', 'react'],
  plugins: [],
};

/**
 * Parses the .babelrc if it exists, if it doesn't it will return a default config
 */
export default function getBabelConfig(
  config: Object | undefined,
  loaderOptions: { disableCodeSandboxPlugins?: boolean },
  path: string,
  isV7: boolean = false
) {
  const resolvedConfig = config || DEFAULT_BABEL_CONFIG;

  if (loaderOptions.disableCodeSandboxPlugins) {
    return resolvedConfig;
  }

  const finalConfig: Partial<{
    sourceMaps: string;
    sourceFileName: string;
    filename: string;
    plugins: string[];
    presets: string[];
  }> = {
    ...resolvedConfig,
    sourceMaps: 'inline',
    sourceFileName: path,
    filename: path,
  };

  const commonjsPluginName = isV7
    ? 'transform-modules-commonjs'
    : 'transform-es2015-modules-commonjs';

  if (finalConfig.plugins) {
    if (finalConfig.plugins.indexOf(commonjsPluginName) === -1) {
      finalConfig.plugins = [...finalConfig.plugins, commonjsPluginName];
    }
  } else {
    finalConfig.plugins = [commonjsPluginName];
  }

  return finalConfig;
}
