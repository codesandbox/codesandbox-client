import { Preset } from 'sandpack-core';

import babelTranspiler from '../../transpilers/babel';
import typescriptTranspiler from '../../transpilers/typescript';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/style';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import noopTranspiler from '../../transpilers/noop';
import binaryTranspiler from '../../transpilers/binary';
import vueTranspiler from '../../transpilers/vue/v2';
import vueTemplateTranspiler from '../../transpilers/vue/v2/template-compiler';
import vueStyleTranspiler from '../../transpilers/vue/v2/style-compiler';
import vueSelector from '../../transpilers/vue/v2/selector';
import vueStyleLoader from '../../transpilers/vue/v2/style-loader';
import cssLoader from '../../transpilers/vue/v2/css-loader';
import base64Transpiler from '../../transpilers/base64';
import pugTranspiler from '../../transpilers/pug';
import coffeeTranspiler from '../../transpilers/coffee';

export default function initialize(vuePreset: Preset) {
  vuePreset.setAdditionalAliases({
    vue$: 'vue/dist/vue.common.js',
  });

  const sassWithConfig = {
    transpiler: sassTranspiler,
    config: {},
  };

  const lessWithConfig = {
    transpiler: lessTranspiler,
    config: {},
  };

  const stylusWithConfig = {
    transpiler: stylusTranspiler,
    config: {},
  };

  /**
   * Registers transpilers for all different combinations
   *
   * @returns
   */
  function registerStyleTranspilers() {
    const styles = {
      css: [],
      scss: [sassWithConfig],
      sass: [sassWithConfig],
      less: [lessWithConfig],
      styl: [stylusWithConfig],
    };

    return Object.keys(styles).forEach(type => {
      vuePreset.registerTranspiler(
        module => new RegExp(`\\.${type}$`).test(module.path),
        [...styles[type], { transpiler: stylesTranspiler }]
      );
    });
  }

  vuePreset.registerTranspiler(module => /\.(m|c)?jsx?$/.test(module.path), [
    { transpiler: babelTranspiler },
  ]);
  vuePreset.registerTranspiler(module => /\.m?tsx?$/.test(module.path), [
    { transpiler: typescriptTranspiler },
    { transpiler: babelTranspiler },
  ]);
  vuePreset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);
  vuePreset.registerTranspiler(module => /\.vue$/.test(module.path), [
    { transpiler: vueTranspiler },
  ]);
  vuePreset.registerTranspiler(module => /\.coffee$/.test(module.path), [
    { transpiler: coffeeTranspiler },
    { transpiler: babelTranspiler },
  ]);

  registerStyleTranspilers();

  vuePreset.registerTranspiler(() => false, [
    { transpiler: vueTemplateTranspiler },
  ]);
  vuePreset.registerTranspiler(() => false, [
    { transpiler: vueStyleTranspiler },
  ]);
  vuePreset.registerTranspiler(() => false, [{ transpiler: vueSelector }]);
  vuePreset.registerTranspiler(() => false, [{ transpiler: vueStyleLoader }]);
  vuePreset.registerTranspiler(() => false, [{ transpiler: cssLoader }]);

  vuePreset.registerTranspiler(module => /\.png$/.test(module.path), [
    { transpiler: binaryTranspiler },
    { transpiler: base64Transpiler },
  ]);
  vuePreset.registerTranspiler(module => /\.svg$/.test(module.path), [
    { transpiler: base64Transpiler },
  ]);
  vuePreset.registerTranspiler(module => /!noop/.test(module.path), [
    { transpiler: noopTranspiler },
  ]);
  vuePreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);
  vuePreset.registerTranspiler(module => /\.pug$/.test(module.path), [
    { transpiler: pugTranspiler },
  ]);

  return vuePreset;
}
