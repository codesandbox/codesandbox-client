import babelTranspiler from '../../transpilers/babel';
import typescriptTranspiler from '../../transpilers/typescript';
import jsonTranspiler from '../../transpilers/json';
import stylesTranspiler from '../../transpilers/css';
import sassTranspiler from '../../transpilers/sass';
import rawTranspiler from '../../transpilers/raw';
import stylusTranspiler from '../../transpilers/stylus';
import lessTranspiler from '../../transpilers/less';
import noopTranspiler from '../../transpilers/noop';
import binaryTranspiler from '../../transpilers/binary';
import vueTranspiler from '../../transpilers/vue';
import vueTemplateTranspiler from '../../transpilers/vue/template-compiler';
import vueStyleTranspiler from '../../transpilers/vue/style-compiler';
import base64Transpiler from '../../transpilers/base64';

import Preset from '../';

const vuePreset = new Preset('vue-cli', ['vue', 'json', 'js']);

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
      module => new RegExp(`\\.${type}`).test(module.title),
      [...styles[type], { transpiler: stylesTranspiler }]
    );
  });
}

vuePreset.registerTranspiler(module => /\.jsx?$/.test(module.title), [
  {
    transpiler: babelTranspiler,
    options: {
      presets: [
        // babel preset env starts with latest, then drops rules.
        // We don't have env, so we just support latest
        'latest',
        'stage-2',
      ],
      plugins: ['transform-runtime', 'transform-vue-jsx'],
    },
  },
]);
vuePreset.registerTranspiler(module => /\.tsx?$/.test(module.title), [
  { transpiler: typescriptTranspiler },
]);
vuePreset.registerTranspiler(module => /\.json$/.test(module.title), [
  { transpiler: jsonTranspiler },
]);
vuePreset.registerTranspiler(module => /\.vue$/.test(module.title), [
  { transpiler: vueTranspiler },
]);

registerStyleTranspilers();

vuePreset.registerTranspiler(() => false, [
  { transpiler: vueTemplateTranspiler },
]);
vuePreset.registerTranspiler(() => false, [{ transpiler: vueStyleTranspiler }]);

vuePreset.registerTranspiler(module => /\.png$/.test(module.title), [
  { transpiler: binaryTranspiler },
  { transpiler: base64Transpiler },
]);
vuePreset.registerTranspiler(module => /!noop/.test(module.title), [
  { transpiler: noopTranspiler },
]);
vuePreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

export default vuePreset;
