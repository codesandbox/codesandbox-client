/* eslint-disable import/no-named-as-default-member, import/default, import/no-named-as-default */
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
  esmReact,
  solid,
} from '@codesandbox/common/lib/templates';

import { isPreact10 } from '@codesandbox/common/lib/utils/is-preact-10';
import { PackageJSON } from '@codesandbox/common/lib/types';
import { reactPreset } from './presets/create-react-app';
import vuePreset from './presets/vue-cli';
import { preactPreset, preactPresetV8 } from './presets/preact-cli';
import sveltePreset from './presets/svelte';
import angularPreset from './presets/angular-cli';
import parcelPreset from './presets/parcel';
import babelPreset from './presets/babel-repl';
import cxjsPreset from './presets/cxjs';
import reasonPreset from './presets/reason';
import dojoPreset from './presets/dojo';
import customPreset from './presets/custom';
import solidPreset from './presets/solid';

export default async function getPreset(template: string, pkg: PackageJSON) {
  switch (template) {
    case esmReact.name:
    case reactTs.name:
    case react.name: {
      const preset = await reactPreset(pkg);
      if (template === esmReact.name) {
        preset.experimentalEsmSupport = true;
      }
      return preset;
    }
    case preact.name:
      if (isPreact10(pkg.dependencies, pkg.devDependencies)) {
        return preactPreset();
      }
      return preactPresetV8();
    case reason.name:
      return reasonPreset();
    case vue.name:
      return vuePreset();
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
    case solid.name:
      return solidPreset();
    case custom.name:
      return customPreset();
    default:
      return reactPreset(pkg);
  }
}
