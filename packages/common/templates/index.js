// @flow
import angular from './angular';
import babel from './babel';
import parcel from './parcel';
import preact from './preact';
import react from './react';
import reactTs from './react-ts';
import svelte from './svelte';
import vue from './vue';
import dojo from './dojo';

export { angular, babel, vue, react, reactTs, preact, svelte, parcel, dojo };

export default function getDefinition(
  theme:
    | 'create-react-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'svelte'
    | 'create-react-app-typescript'
    | 'angular-cli'
    | 'parcel'
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
    case dojo.name:
      return dojo;
    default:
      return react;
  }
}
