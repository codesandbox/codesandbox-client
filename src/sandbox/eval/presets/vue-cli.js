import babelTranspiler from '../transpilers/babel';
import typescriptTranspiler from '../transpilers/typescript';
import jsonTranspiler from '../transpilers/json';
import globalCSSTranspiler from '../transpilers/css/global';
import modulesCSSTranspiler from '../transpilers/css/modules';
import sassTranspiler from '../transpilers/sass';
import rawTranspiler from '../transpilers/raw';
import stylusTranspiler from '../transpilers/stylus';
import lessTranspiler from '../transpilers/less';
import noopTranspiler from '../transpilers/noop';
import binaryTranspiler from '../transpilers/binary';
import vueTranspiler from '../transpilers/vue';
import vueTemplateTranspiler from '../transpilers/vue/template-compiler';
import vueStyleTranspiler from '../transpilers/vue/style-compiler';
import base64Transpiler from '../transpilers/base64';

import Preset from './';

const vuePreset = new Preset('vue-cli', ['vue', 'json', 'js']);

/**
 * Registers transpilers for all different combinations
 *
 * @returns
 */
function registerStyleTranspilers() {
  const styles = {
    css: [],
    scss: [sassTranspiler],
    sass: [sassTranspiler],
    less: [lessTranspiler],
    styl: [stylusTranspiler],
  };

  return Object.keys(styles).forEach(type => {
    vuePreset.registerTranspiler(
      module => new RegExp(`\\.vue\\.module\\.${type}`).test(module.title),
      [...styles[type], vueStyleTranspiler, modulesCSSTranspiler],
    );

    vuePreset.registerTranspiler(
      module => new RegExp(`\\.vue\\.${type}`).test(module.title),
      [...styles[type], vueStyleTranspiler, globalCSSTranspiler],
    );

    vuePreset.registerTranspiler(
      module => new RegExp(`\\.${type}`).test(module.title),
      [...styles[type], globalCSSTranspiler],
    );
  });
}

vuePreset.registerTranspiler(module => /\.jsx?$/.test(module.title), [
  babelTranspiler,
]);
vuePreset.registerTranspiler(module => /\.tsx?$/.test(module.title), [
  typescriptTranspiler,
]);
vuePreset.registerTranspiler(module => /\.json$/.test(module.title), [
  jsonTranspiler,
]);
vuePreset.registerTranspiler(module => /\.vue$/.test(module.title), [
  vueTranspiler,
]);

registerStyleTranspilers();

vuePreset.registerTranspiler(module => /\.vue\.html/.test(module.title), [
  vueTemplateTranspiler,
]);
vuePreset.registerTranspiler(module => /\.png$/.test(module.title), [
  binaryTranspiler,
  base64Transpiler,
]);
vuePreset.registerTranspiler(module => /!noop/.test(module.title), [
  noopTranspiler,
]);
vuePreset.registerTranspiler(() => true, [rawTranspiler]);

export default vuePreset;
