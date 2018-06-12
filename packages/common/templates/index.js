// @flow
import angular from './angular';
import babel from './babel';
import parcel from './parcel';
import preact from './preact';
import react from './react';
import reactTs from './react-ts';
import svelte from './svelte';
import vue from './vue';
import cxjs from './cxjs';
import dojo from './dojo';
import gatsby from './gatsby';
import nuxt from './nuxt';

export {
  angular,
  gatsby,
  nuxt,
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

export type Template =
  | 'create-react-app'
  | 'vue-cli'
  | 'preact-cli'
  | 'svelte'
  | 'create-react-app-typescript'
  | 'angular-cli'
  | 'parcel'
  | 'cxjs'
  | '@dojo/cli-create-app'
  | 'gatsby'
  | 'nuxt';

export default function getDefinition(theme: Template) {
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
    case gatsby.name:
      return gatsby;
    case nuxt.name:
      return nuxt;
    default:
      return react;
  }
}
