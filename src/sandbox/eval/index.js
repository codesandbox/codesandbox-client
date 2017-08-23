// @flow
import { react, vue, preact } from 'common/templates';

import reactPreset from './presets/create-react-app';
import vuePreset from './presets/vue-cli';
import preactPreset from './presets/preact-cli';

export default function getPreset(template: string) {
  switch (template) {
    case react.name:
      return reactPreset;
    case vue.name:
      return vuePreset;
    case preact.name:
      return preactPreset;
    default:
      return reactPreset;
  }
}
