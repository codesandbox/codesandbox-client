import { Preset } from 'sandpack-core';

import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import postcssTranspiler from '../../transpilers/postcss';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import coffeeTranspiler from '../../transpilers/coffee';
import noopTranspiler from '../../transpilers/noop';

export default function initialize() {
  const solidPreset = new Preset(
    'solid',
    [
      'js',
      'mjs',
      'cjs',
      'jsx',
      'ts',
      'tsx',
      'json',
      'less',
      'scss',
      'sass',
      'styl',
      'css',
    ],
    {},
    {
      processDependencies: async originalDeps => {
        const deps = { ...originalDeps };

        if (!deps['solid-refresh']) {
          deps['solid-refresh'] = '^0.5.2';
        }

        if (!deps['babel-preset-solid']) {
          deps['babel-preset-solid'] = '^1.2.0';
        }

        if (!deps['@babel/core']) {
          deps['@babel/core'] = '^7.15.8';
        }

        if (!deps['@babel/plugin-syntax-dynamic-import']) {
          deps['@babel/plugin-syntax-dynamic-import'] = '^7.8.3';
        }

        if (!deps['@babel/runtime']) {
          deps['@babel/runtime'] = '^7.17.9';
        }

        if (!deps['@babel/preset-typescript']) {
          deps['@babel/preset-typescript'] = '^7.16.7';
        }

        // No babel 6 support
        delete deps['babel-core'];

        return deps;
      },
    }
  );

  solidPreset.registerTranspiler(module => /\.coffee$/.test(module.path), [
    { transpiler: coffeeTranspiler },
    { transpiler: babelTranspiler, options: { isV7: true } },
  ]);

  solidPreset.registerTranspiler(
    module => /\.(m|c)?(t|j)sx?$/.test(module.path),
    [
      {
        transpiler: babelTranspiler,
        options: {
          isV7: true,
          dynamicCSSModules: true,
        },
      },
    ]
  );

  solidPreset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: postcssTranspiler },
    { transpiler: stylesTranspiler },
  ]);

  solidPreset.registerTranspiler(module => /\.s[c|a]ss$/.test(module.path), [
    { transpiler: sassTranspiler },
    { transpiler: postcssTranspiler },
    {
      transpiler: stylesTranspiler,
    },
  ]);

  solidPreset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  const sassWithConfig = {
    transpiler: sassTranspiler,
    options: {},
  };

  const lessWithConfig = {
    transpiler: lessTranspiler,
    options: {},
  };

  const stylusWithConfig = {
    transpiler: stylusTranspiler,
    options: {},
  };
  const styles = {
    css: [],
    scss: [sassWithConfig],
    sass: [sassWithConfig],
    less: [lessWithConfig],
    styl: [stylusWithConfig],
  };

  /**
   * Registers transpilers for all different combinations
   *
   * @returns
   */
  function registerStyleTranspilers() {
    return Object.keys(styles).forEach(type => {
      solidPreset.registerTranspiler(
        module => new RegExp(`\\.${type}$`).test(module.path),
        [...styles[type], { transpiler: stylesTranspiler }]
      );
    });
  }

  registerStyleTranspilers();

  solidPreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  solidPreset.registerTranspiler(() => false, [{ transpiler: noopTranspiler }]);

  return solidPreset;
}
