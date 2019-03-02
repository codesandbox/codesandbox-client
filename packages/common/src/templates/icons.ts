// @flow

import React from '../components/logos/React';
import Angular from '../components/logos/Angular';
import Ember from '../components/logos/Ember';
import Parcel from '../components/logos/Parcel';
import Preact from '../components/logos/Preact';
import Vue from '../components/logos/Vue';
import Svelte from '../components/logos/Svelte';
import Sapper from '../components/logos/Sapper';
import Dojo from '../components/logos/Dojo';
import CxJS from '../components/logos/CxJS';
import Reason from '../components/logos/Reason';
import Gatsby from '../components/logos/Gatsby';
import Next from '../components/logos/Next';
import Nuxt from '../components/logos/Nuxt';
import Node from '../components/logos/Node';
import Apollo from '../components/logos/Apollo';
import Nest from '../components/logos/Nest';
import Static from '../components/logos/Static';
import Styleguidist from '../components/logos/Styleguidist';

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

import { TemplateType } from './';

export type ReturnedIcon = React.SFC<{
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}>;

export default function getIcon(theme: TemplateType): ReturnedIcon {
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
