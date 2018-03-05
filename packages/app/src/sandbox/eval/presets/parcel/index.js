import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import tsTranspiler from '../../transpilers/typescript';
import htmlTranspiler from './transpilers/html-transpiler';

import Preset from '../';

export default function initialize() {
  const parcelPreset = new Preset(
    'parcel',
    ['js', 'jsx', 'ts', 'tsx', 'json', 'less', 'scss', 'sass', 'styl', 'css'],
    {},
    { htmlDisabled: true }
  );

  parcelPreset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
    {
      transpiler: babelTranspiler,
      options: {
        dynamicCSSModules: true,
      },
    },
  ]);

  parcelPreset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: tsTranspiler },
  ]);

  parcelPreset.registerTranspiler(module => /\.html$/.test(module.path), [
    { transpiler: htmlTranspiler },
  ]);

  parcelPreset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
  ]);

  parcelPreset.registerTranspiler(module => /\.json$/.test(module.path), [
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
      parcelPreset.registerTranspiler(
        module => new RegExp(`\\.${type}`).test(module.path),
        [...styles[type], { transpiler: stylesTranspiler }]
      );
    });
  }

  registerStyleTranspilers();

  parcelPreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return parcelPreset;
}
