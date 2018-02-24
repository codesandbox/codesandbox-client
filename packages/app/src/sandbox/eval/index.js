// @flow
import {
  react,
  vue,
  parcel,
  svelte,
  preact,
  reactTs,
  angular,
} from 'common/templates';

import reactPreset from './presets/create-react-app';
import reactTsPreset from './presets/create-react-app-typescript';
import vuePreset from './presets/vue-cli';
import preactPreset from './presets/preact-cli';
import sveltePreset from './presets/svelte';
import angularPreset from './presets/angular-cli';
import parcelPreset from './presets/parcel';

export default function getPreset(template: string) {
  switch (template) {
    case react.name:
      return reactPreset();
    case reactTs.name:
      return reactTsPreset();
    case vue.name:
      return vuePreset();
    case preact.name:
      return preactPreset();
    case svelte.name:
      return sveltePreset();
    case angular.name:
      return angularPreset();
    case parcel.name:
      return parcelPreset();
    default:
      return reactPreset();
  }
}
