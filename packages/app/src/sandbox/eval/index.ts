/* eslint-disable import/no-named-as-default-member, import/default, import/no-named-as-default */
import {
  angular,
  babel,
  custom,
  cxjs,
  dojo,
  parcel,
  preact,
  react,
  reactTs,
  reason,
  svelte,
  vue,
} from '@codesandbox/common/es/templates';
import { PackageJSON } from '@codesandbox/common/es/types';
import { isBabel7 } from '@codesandbox/common/es/utils/is-babel-7';

import angularPreset from './presets/angular-cli';
import babelPreset from './presets/babel-repl';
import { reactPresetV1, reactPresetV3 } from './presets/create-react-app';
import reactTsPreset from './presets/create-react-app-typescript';
import customPreset from './presets/custom';
import cxjsPreset from './presets/cxjs';
import dojoPreset from './presets/dojo';
import parcelPreset from './presets/parcel';
import preactPreset from './presets/preact-cli';
import reasonPreset from './presets/reason';
import sveltePreset from './presets/svelte';
import vuePreset from './presets/vue-cli';

export default function getPreset(template: string, pkg: PackageJSON) {
  switch (template) {
    case react.name:
      if (isBabel7(pkg.dependencies, pkg.devDependencies)) {
        return reactPresetV3();
      }

      return reactPresetV1();

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
      return reactPresetV3();
  }
}
