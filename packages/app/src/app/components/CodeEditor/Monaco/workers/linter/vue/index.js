import plugin from 'eslint-plugin-vue';
import * as parser from 'vue-eslint-parser';
import config from './default-config';

let pluginsInitialized = false;

export async function getConfig(linter) {
  if (!pluginsInitialized) {
    pluginsInitialized = true;

    linter.defineParser('vue-eslint-parser', parser);
    Object.keys(plugin.rules).forEach(name => {
      linter.defineRule(`vue/${name}`, plugin.rules[name]);
    });
  }

  return config;
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
