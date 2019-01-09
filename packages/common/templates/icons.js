// @flow

import React from 'common/components/logos/React';
import Angular from 'common/components/logos/Angular';
import Ember from 'common/components/logos/Ember';
import Parcel from 'common/components/logos/Parcel';
import Preact from 'common/components/logos/Preact';
import Vue from 'common/components/logos/Vue';
import Svelte from 'common/components/logos/Svelte';
import Sapper from 'common/components/logos/Sapper';
import Dojo from 'common/components/logos/Dojo';
import CxJS from 'common/components/logos/CxJS';
import Reason from 'common/components/logos/Reason';
import Gatsby from 'common/components/logos/Gatsby';
import Next from 'common/components/logos/Next';
import Nuxt from 'common/components/logos/Nuxt';
import Node from 'common/components/logos/Node';
import Apollo from 'common/components/logos/Apollo';
import Nest from 'common/components/logos/Nest';
import Static from 'common/components/logos/Static';
import Styleguidist from 'common/components/logos/Styleguidist';

import {
  react,
  ember,
  vue,
  preact,
  reactTs,
  svelte,
  angular,
  parcel,
  dojo,
  cxjs,
  reason,
  gatsby,
  next,
  nuxt,
  node,
  apollo,
  nest,
  sapper,
  staticTemplate,
  styleguidist,
} from './';

import type { Template } from './';

export default function getIcon(theme: Template) {
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
    case ember.name:
      return Ember;
    case sapper.name:
      return Sapper;
    case cxjs.name:
      return CxJS;
    case reason.name:
      return Reason;
    case gatsby.name:
      return Gatsby;
    case next.name:
      return Next;
    case nuxt.name:
      return Nuxt;
    case node.name:
      return Node;
    case apollo.name:
      return Apollo;
    case nest.name:
      return Nest;
    case staticTemplate.name:
      return Static;
    case styleguidist.name:
      return Styleguidist;
    default:
      return React;
  }
}
