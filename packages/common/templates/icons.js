// @flow

import React from 'common/components/logos/React';
import Angular from 'common/components/logos/Angular';
import Parcel from 'common/components/logos/Parcel';
import Preact from 'common/components/logos/Preact';
import Vue from 'common/components/logos/Vue';
import Svelte from 'common/components/logos/Svelte';
import Dojo from 'common/components/logos/Dojo';
import CxJS from 'common/components/logos/CxJS';

import {
  react,
  vue,
  preact,
  reactTs,
  svelte,
  angular,
  parcel,
  dojo,
  cxjs,
} from './';

export default function getIcon(
  theme:
    | 'create-react-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'svelte'
    | 'create-react-app-typescript'
    | 'angular-cli'
    | 'parcel'
    | 'dojo'
    | 'cxjs'
) {
  switch (theme) {
    case react.name:
      return React;
    case vue.name:
      return Vue;
    case preact.name:
      return Preact;
    case reactTs.name:
      return React;
    case svelte.name:
      return Svelte;
    case angular.name:
      return Angular;
    case parcel.name:
      return Parcel;
    case dojo.name:
      return Dojo;
    case cxjs.name:
      return CxJS;
    default:
      return React;
  }
}
