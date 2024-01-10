import { dispatch, actions } from 'codesandbox-api';
import semver from 'semver';
import { Manager, Preset } from 'sandpack-core';

import initializeV2 from './v2';
import initializeV3 from './v3';

function isMinimalSemverVersion(version: string, minimalVersion: string) {
  try {
    return semver.gte(version, minimalVersion);
  } catch (e) {
    // Semver couldn't be parsed, we assume that we're on the bleeding edge now, so true.
    return true;
  }
}

const getFileNameFromVm = vm => {
  if (vm) {
    let options = vm || {};

    if (typeof vm === 'function' && vm.cid != null) {
      options = vm.options;
    } else if (vm._isVue) {
      options = vm.$options || vm.constructor.options;
    }

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
    },
    {
      setup: async (manager: Manager) => {
        const dependencies = manager.manifest.dependencies;
        const vue = dependencies.find(dep => dep.name === 'vue');
        const isV3 = vue && isMinimalSemverVersion(vue.version, '3.0.0');

        try {
          const tModule = await manager.resolveTranspiledModule(
            '@vue/babel-plugin-jsx',
            '/package.json',
            []
          );
          await tModule.transpile(manager);
        } catch (e) {
          console.error(e);
          // Ignore
        }

        if (isV3) {
          await initializeV3(vuePreset);
        } else {
          initializeV2(vuePreset);
        }

        try {
          const vueModule = await manager.resolveTranspiledModule('vue', '/');

          await vueModule.transpileTree(manager);

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

  return vuePreset;
}
