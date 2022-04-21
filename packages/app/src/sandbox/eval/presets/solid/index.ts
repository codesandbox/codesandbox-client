import { Preset } from 'sandpack-core';

import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import postcssTranspiler from '../../transpilers/postcss';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import tsTranspiler from '../../transpilers/typescript';
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
          deps['solid-refresh'] = '^0.4.0';
        }

        if (!deps['babel-preset-solid']) {
          deps['babel-preset-solid'] = '^1.2.0';
        }

        if (!deps['@babel/core']) {
          deps['@babel/core'] = '^7.15.8';
        }

        // No babel 6 support
        delete deps['babel-core'];

        return deps;
      },
    }
  );

  solidPreset.registerTranspiler(module => /\.coffee$/.test(module.path), [
    { transpiler: coffeeTranspiler },
    { transpiler: babelTranspiler },
  ]);

  solidPreset.registerTranspiler(module => /\.(m|c)?jsx?$/.test(module.path), [
    {
      transpiler: babelTranspiler,
      options: {
        dynamicCSSModules: true,
      },
    },
  ]);

  solidPreset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: tsTranspiler },
    {
      transpiler: babelTranspiler,
      options: {
        dynamicCSSModules: true,
      },
    },
  ]);

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
