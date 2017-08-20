// @flow
import { react, vue } from 'common/templates';

import reactPreset from './presets/create-react-app';
import vuePreset from './presets/vue-cli';

export default function getPreset(template: 'create-react-app' | 'vue-cli') {
  if (template === react.name) {
    return reactPreset;
  } else if (template === vue.name) {
    return vuePreset;
  }
}
