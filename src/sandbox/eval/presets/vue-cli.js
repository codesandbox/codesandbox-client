import babelTranspiler from '../transpilers/babel';
import typescriptTranspiler from '../transpilers/typescript';
import jsonTranspiler from '../transpilers/json';
import globalCSSTranspiler from '../transpilers/css/global';
import modulesCSSTranspiler from '../transpilers/css/modules';
import sassTranspiler from '../transpilers/sass';
import rawTranspiler from '../transpilers/raw';
import stylusTranspiler from '../transpilers/stylus';
import noopTranspiler from '../transpilers/noop';
import binaryTranspiler from '../transpilers/binary';
import vueTranspiler from '../transpilers/vue';
import vueTemplateTranspiler from '../transpilers/vue/template-compiler';
import vueStyleTranspiler from '../transpilers/vue/style-compiler';
import base64Transpiler from '../transpilers/base64';

import Preset from './';

const vuePreset = new Preset('vue-cli');

vuePreset.registerTranspiler(module => /\.jsx?$/.test(module.title), [
  babelTranspiler,
]);
vuePreset.registerTranspiler(module => /\.tsx?$/.test(module.title), [
  typescriptTranspiler,
]);
vuePreset.registerTranspiler(module => /\.json$/.test(module.title), [
  jsonTranspiler,
]);
vuePreset.registerTranspiler(module => /\.scss$/.test(module.title), [
  sassTranspiler,
  globalCSSTranspiler,
]);
vuePreset.registerTranspiler(module => /\.vue$/.test(module.title), [
  vueTranspiler,
]);

function registerStyleTranspilers() {
  const styles = {
    scss: sassTranspiler,
    sass: sassTranspiler,
    less: lessTranspiler,
    styl: stylusTranspiler,
  };
}

vuePreset.registerTranspiler(module => /\.vue\.html/.test(module.title), [
  vueTemplateTranspiler,
]);
vuePreset.registerTranspiler(module => /\.vue\.css/.test(module.title), [
  vueStyleTranspiler,
  globalCSSTranspiler,
]);
vuePreset.registerTranspiler(
  module => /\.vue\.module\.css/.test(module.title),
  [vueStyleTranspiler, modulesCSSTranspiler],
);
vuePreset.registerTranspiler(module => /\.vue\.s[c|a]ss/.test(module.title), [
  sassTranspiler,
  vueStyleTranspiler,
  globalCSSTranspiler,
]);
vuePreset.registerTranspiler(
  module => /\.vue\.module\.s[c|a]ss/.test(module.title),
  [sassTranspiler, vueStyleTranspiler, modulesCSSTranspiler],
);
vuePreset.registerTranspiler(module => /\.vue\.styl$/.test(module.title), [
  stylusTranspiler,
  vueStyleTranspiler,
  globalCSSTranspiler,
]);
vuePreset.registerTranspiler(module => /\.png$/.test(module.title), [
  binaryTranspiler,
  base64Transpiler,
]);
vuePreset.registerTranspiler(module => /\.css$/.test(module.title), [
  globalCSSTranspiler,
]);
vuePreset.registerTranspiler(module => /!noop/.test(module.title), [
  noopTranspiler,
]);
vuePreset.registerTranspiler(() => true, [rawTranspiler]);
