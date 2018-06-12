// @flow
import angular from './angular';
import babel from './babel';
import ember from './ember';
import parcel from './parcel';
import preact from './preact';
import react from './react';
import reactTs from './react-ts';
import svelte from './svelte';
import vue from './vue';
import cxjs from './cxjs';
import dojo from './dojo';

export {
  angular,
  ember,
  babel,
  vue,
  react,
  reactTs,
  preact,
  svelte,
  parcel,
  dojo,
  cxjs,
};

export default function getDefinition(
  theme:
    | 'create-react-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'svelte'
    | 'create-react-app-typescript'
    | 'angular-cli'
    | 'parcel'
    | 'cxjs'
    | '@dojo/cli-create-app'
    | 'ember'
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
    case ember.name:
      return ember;
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
    default:
      return react;
  }
}
