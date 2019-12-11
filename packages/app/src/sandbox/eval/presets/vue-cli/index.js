import { dispatch, actions } from 'codesandbox-api';

import type Manager from '../../manager';

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
import vueTranspiler from '../../transpilers/vue';
import vueTemplateTranspiler from '../../transpilers/vue/template-compiler';
import vueStyleTranspiler from '../../transpilers/vue/style-compiler';
import vueSelector from '../../transpilers/vue/selector';
import vueStyleLoader from '../../transpilers/vue/style-loader';
import cssLoader from '../../transpilers/vue/css-loader';
import base64Transpiler from '../../transpilers/base64';
import pugTranspiler from '../../transpilers/pug';
import coffeeTranspiler from '../../transpilers/coffee';

import Preset from '..';

const getFileNameFromVm = vm => {
  if (vm) {
    const options =
      typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};

    return options.__file;
  }
  return undefined;
};

export default function initialize() {
  const vuePreset = new Preset(
    'vue-cli',
    ['vue', 'json', 'js', 'ts'],
    {
      '@': '{{sandboxRoot}}/src',
      vue$: 'vue/dist/vue.common.js',
    },
    {
      setup: async (manager: Manager) => {
        try {
          const vueModule = manager.resolveTranspiledModule('vue', '/');

          if (!vueModule.source) {
            await vueModule.transpile(manager);
          }
          const Vue = vueModule.evaluate(manager);

          if (Vue) {
            Vue.config.warnHandler = (msg, vm, trace) => {
              console.error('[Vue warn]: ' + msg + trace);

              const file = getFileNameFromVm(vm);

              dispatch(
                actions.correction.show(msg, {
                  line: 1,
                  column: 1,
                  path: file,
                  severity: 'warning',
                  source: 'Vue',
                })
              );
            };
          }
        } catch (e) {
          /* ignore */
        }
      },
    }
  );

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
        module => new RegExp(`\\.${type}`).test(module.path),
        [...styles[type], { transpiler: stylesTranspiler }]
      );
    });
  }

  vuePreset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
    { transpiler: babelTranspiler },
  ]);
  vuePreset.registerTranspiler(module => /\.tsx?$/.test(module.path), [
    { transpiler: typescriptTranspiler },
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
  vuePreset.registerTranspiler(module => /!noop/.test(module.path), [
    { transpiler: noopTranspiler },
  ]);
  vuePreset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);
  vuePreset.registerTranspiler(module => /\.pug$/.test(module.path), [
    { transpiler: pugTranspiler },
  ]);

  return vuePreset;
}
