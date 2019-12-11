import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import tsTranspiler from '../../transpilers/typescript';

import Preset from '..';

export default function initialize() {
  const cxjsPreset = new Preset(
    'cxjs',
    ['js', 'jsx', 'ts', 'tsx', 'json', 'less', 'scss', 'sass', 'styl', 'css'],
    {},
    {}
  );

  cxjsPreset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
    {
      transpiler: babelTranspiler,
      options: {
        dynamicCSSModules: true,
        compileNodeModulesWithEnv: true,
      },
    },
  ]);

  cxjsPreset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: tsTranspiler },
  ]);

  cxjsPreset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
  ]);

  cxjsPreset.registerTranspiler(module => /\.json$/.test(module.path), [
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
      cxjsPreset.registerTranspiler(
        module => new RegExp(`\\.${type}`).test(module.path),
        [...styles[type], { transpiler: stylesTranspiler }]
      );
    });
  }

  registerStyleTranspilers();

  cxjsPreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return cxjsPreset;
}
