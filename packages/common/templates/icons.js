// @flow

import React from 'common/components/logos/React';
import Angular from 'common/components/logos/Angular';
import Parcel from 'common/components/logos/Parcel';
import Preact from 'common/components/logos/Preact';
import Vue from 'common/components/logos/Vue';
import Svelte from 'common/components/logos/Svelte';

import { react, vue, preact, reactTs, svelte, angular, parcel } from './';

export default function getIcon(
  theme:
    | 'create-react-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'svelte'
    | 'create-react-app-typescript'
    | 'angular-cli'
    | 'parcel'
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
    default:
      return React;
  }
}
