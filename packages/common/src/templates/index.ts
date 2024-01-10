import adonis from './adonis';
import angular from './angular';
import apollo from './apollo-server';
import babel from './babel';
import custom from './custom';
import cxjs from './cxjs';
import dojo from './dojo';
import ember from './ember';
import gatsby from './gatsby';
import gridsome from './gridsome';
import marko from './marko';
import mdxDeck from './mdx-deck';
import nest from './nest';
import next from './next';
import node from './node';
import nuxt from './nuxt';
import parcel from './parcel';
import preact from './preact';
import quasar from './quasar';
import react from './react';
import reactTs from './react-ts';
import reason from './reason';
import sapper from './sapper';
import staticTemplate from './static';
import styleguidist from './styleguidist';
import svelte from './svelte';
import unibit from './unibit';
import vue from './vue';
import vuepress from './vuepress';
import docusaurus from './docusaurus';
import esmReact from './esmodule-react';
import remix from './remix';
import solid from './solid';

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
  esmReact,
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
  docusaurus,
  mdxDeck,
  quasar,
  unibit,
  remix,
  solid,
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
  | 'unibit'
  | 'node'
  | 'ember'
  | 'custom'
  | 'docusaurus'
  | 'babel-repl'
  | 'esm-react'
  | 'remix-starter'
  | 'solid';

export default function getDefinition(theme?: TemplateType | null) {
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
    case docusaurus.name:
      return docusaurus;
    case quasar.name:
      return quasar;
    case unibit.name:
      return unibit;
    case esmReact.name:
      return esmReact;
    case remix.name:
      return remix;
    case solid.name:
      return solid;
    default:
      return react;
  }
}
