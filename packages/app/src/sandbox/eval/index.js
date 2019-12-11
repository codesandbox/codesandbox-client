// @ts-check
import {
  react,
  vue,
  parcel,
  svelte,
  preact,
  reactTs,
  angular,
  cxjs,
  babel,
  dojo,
  custom,
  reason,
} from '@codesandbox/common/lib/templates';

import reactPreset from './presets/create-react-app';
import reactTsPreset from './presets/create-react-app-typescript';
import vuePreset from './presets/vue-cli';
import preactPreset from './presets/preact-cli';
import sveltePreset from './presets/svelte';
import angularPreset from './presets/angular-cli';
import parcelPreset from './presets/parcel';
import babelPreset from './presets/babel-repl';
import cxjsPreset from './presets/cxjs';
import reasonPreset from './presets/reason';
import dojoPreset from './presets/dojo';
import customPreset from './presets/custom';

export default function getPreset(template: string) {
  switch (template) {
    case react.name:
      return reactPreset();
    case reactTs.name:
      return reactTsPreset();
    case reason.name:
      return reasonPreset();
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
    case babel.name:
      return babelPreset();
    case cxjs.name:
      return cxjsPreset();
    case dojo.name:
      return dojoPreset();
    case custom.name:
      return customPreset();
    default:
      return reactPreset();
  }
}
