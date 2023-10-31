/* eslint-disable */
import plugin from 'browser-eslint-rules/lib/eslint-plugin-vue';
import parser from 'browser-eslint-rules/lib/vue-eslint-parser';
import vue2Config from './default-vue-2-config';
import vue3Config from './default-vue-3-config';

let pluginsInitialized = false;

export async function getConfig(linter, isVue2 = true) {
  if (!pluginsInitialized) {
    pluginsInitialized = true;

    linter.defineParser('vue-eslint-parser', parser);
    Object.keys(plugin.rules).forEach(name => {
      linter.defineRule(`vue/${name}`, plugin.rules[name]);
    });
  }

  return isVue2 ? vue2Config : vue3Config;
}

export function getVerifyOptions(filename: string) {
  if (filename.endsWith('.vue')) {
    return {
      preprocess: plugin.processors['.vue'].preprocess,
      postprocess: plugin.processors['.vue'].postprocess,
    };
  }

  return {};
}
