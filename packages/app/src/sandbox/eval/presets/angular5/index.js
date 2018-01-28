import Preset from '../';

import angular2Transpiler from '../../transpilers/angular2-template';
import typescriptTranspiler from '../../transpilers/typescript';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';

export default function initialize() {
  const preset = new Preset('angular5', [
    'web.ts',
    'ts',
    'json',
    'web.tsx',
    'tsx',
    'js',
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
      preset.registerTranspiler(
        module => new RegExp(`\\.${type}`).test(module.path),
        [...styles[type], { transpiler: stylesTranspiler }]
      );
    });
  }

  registerStyleTranspilers();

  preset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: angular2Transpiler, options: { preTranspilers: styles } },
    { transpiler: typescriptTranspiler },
  ]);

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
