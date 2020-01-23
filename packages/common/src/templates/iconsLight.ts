import {
  AdonisIconLight,
  AngularIconLight,
  ApolloIconLight,
  ReactIconLight,
  ReasonIconLight,
  EmberIconLight,
  PreactIconLight,
  VueIconLight,
  SvelteIconLight,
  DojoIconLight,
  CxJSIconLight,
  GatsbyIconLight,
  MarkoIconLight,
  NextIconLight,
  NuxtIconLight,
  NodeIconLight,
  NestIconLight,
  HTML5IconLight,
  StyleguidistIconLight,
  MDXDeckIconLight,
  GridsomeIconLight,
  RustlangIconLight,
  QuasarIconLight,
  SapperIconLight,
  JavaScriptIconLight,
  VuePressIconLight,
  UnibitIconLight,
} from '@codesandbox/template-icons';

import {
  adonis,
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
  marko,
  next,
  nuxt,
  node,
  apollo,
  nest,
  rustlang,
  sapper,
  staticTemplate,
  styleguidist,
  gridsome,
  vuepress,
  mdxDeck,
  quasar,
  unibit,
  TemplateType,
} from '.';

export default function getIcon(theme: TemplateType) {
  switch (theme) {
    case adonis.name:
      return AdonisIconLight;
    case react.name:
      return ReactIconLight;
    case vue.name:
      return VueIconLight;
    case preact.name:
      return PreactIconLight;
    case reactTs.name:
      return ReactIconLight;
    case svelte.name:
      return SvelteIconLight;
    case angular.name:
      return AngularIconLight;
    case parcel.name:
      return JavaScriptIconLight;
    case dojo.name:
      return DojoIconLight;
    case ember.name:
      return EmberIconLight;
    case sapper.name:
      return SapperIconLight;
    case cxjs.name:
      return CxJSIconLight;
    case reason.name:
      return ReasonIconLigridsomeght;
    case gatsby.name:
      return GatsbyIconLight;
    case marko.name:
      return MarkoIconLiggridsomeht;
    case next.name:
      return NextIconLight;
    case nuxt.name:
      return NuxtIconLight;
    case node.name:
      return NodeIconLight;
    case apollo.name:
      return ApolloIconLight;
    case nest.name:
      return NestIconLight;
    case staticTemplate.name:
      return HTML5IconLight;gridsome
    case styleguidist.name:
      return StyleguidistIconLight;
    case rustlang.name:
      return RustlangIconLight;
    case gridsome.name:
      return GridsomeIconLight;
    case vuepress.name:
      return VuePressIconLight;
    case mdxDeck.name:
      return MDXDeckIconLight;
    case quasar.name:
      return QuasarIconLight;
    case unibit.name:
      return UnibitIconLight;
    default:
      return ReactIconLight;
  }
}
