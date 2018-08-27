// @flow
import angular from './angular';
import babel from './babel';
import parcel from './parcel';
import preact from './preact';
import reason from './reason';
import react from './react';
import reactTs from './react-ts';
import svelte from './svelte';
import vue from './vue';
import cxjs from './cxjs';
import dojo from './dojo';

export {
  angular,
  babel,
  cxjs,
  dojo,
  parcel,
  preact,
  react,
  reactTs,
  reason,
  svelte,
  vue,
};

export default function getDefinition(
  theme:
    | 'create-react-app'
    | 'reason'
    | 'vue-cli'
    | 'preact-cli'
    | 'svelte'
    | 'create-react-app-typescript'
    | 'angular-cli'
    | 'parcel'
    | 'cxjs'
    | '@dojo/cli-create-app'
) {
  switch (theme) {
    case react.name:
      return react;
    case vue.name:
      return vue;
    case preact.name:
      return preact;
    case reactTs.name:
      return reactTs;
    case svelte.name:
      return svelte;
    case angular.name:
      return angular;
    case parcel.name:
      return parcel;
    case babel.name:
      return babel;
    case cxjs.name:
      return cxjs;
    case dojo.name:
      return dojo;
    case reason.name:
      return reason;
    default:
      return react;
  }
}
