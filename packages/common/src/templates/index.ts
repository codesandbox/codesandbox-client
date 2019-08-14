import adonis from './adonis';
import angular from './angular';
import babel from './babel';
import parcel from './parcel';
import preact from './preact';
import reason from './reason';
import react from './react';
import reactTs from './react-ts';
import svelte from './svelte';
import vue from './vue';
import ember from './ember';
import cxjs from './cxjs';
import dojo from './dojo';
import custom from './custom';
import gatsby from './gatsby';
import marko from './marko';
import nuxt from './nuxt';
import next from './next';
import node from './node';
import apollo from './apollo-server';
import sapper from './sapper';
import nest from './nest';
import staticTemplate from './static';
import styleguidist from './styleguidist';
import gridsome from './gridsome';
import vuepress from './vuepress';
import mdxDeck from './mdx-deck';
import quasar from './quasar';
import unibit from './unibit';

export {
  adonis,
  angular,
  custom,
  apollo,
  gatsby,
  marko,
  next,
  nuxt,
  node,
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
  sapper,
  nest,
  ember,
  staticTemplate,
  styleguidist,
  gridsome,
  vuepress,
  mdxDeck,
  quasar,
  unibit,
};

export type TemplateType =
  | 'adonis'
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
  | 'marko'
  | 'nuxt'
  | 'next'
  | 'reason'
  | 'apollo'
  | 'sapper'
  | 'nest'
  | 'static'
  | 'styleguidist'
  | 'gridsome'
  | 'vuepress'
  | 'mdx-deck'
  | 'quasar'
  | 'unibit';

export default function getDefinition(theme: TemplateType) {
  switch (theme) {
    case adonis.name:
      return adonis;
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
    case custom.name:
      return custom;
    case gatsby.name:
      return gatsby;
    case marko.name:
      return marko;
    case nuxt.name:
      return nuxt;
    case next.name:
      return next;
    case reason.name:
      return reason;
    case node.name:
      return node;
    case apollo.name:
      return apollo;
    case sapper.name:
      return sapper;
    case nest.name:
      return nest;
    case staticTemplate.name:
      return staticTemplate;
    case styleguidist.name:
      return styleguidist;
    case mdxDeck.name:
      return mdxDeck;
    case gridsome.name:
      return gridsome;
    case ember.name:
      return ember;
    case vuepress.name:
      return vuepress;
    case quasar.name:
      return quasar;
    case unibit.name:
      return unibit;
    default:
      return react;
  }
}
