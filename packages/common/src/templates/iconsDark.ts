import {
  AdonisIconDark,
  AngularIconDark,
  ApolloIconDark,
  ReactIconDark,
  ReasonIconDark,
  EmberIconDark,
  PreactIconDark,
  VueIconDark,
  SvelteIconDark,
  DojoIconDark,
  CxJSIconDark,
  GatsbyIconDark,
  MarkoIconDark,
  NextIconDark,
  NuxtIconDark,
  NodeIconDark,
  NestIconDark,
  HTML5IconDark,
  StyleguidistIconDark,
  MDXDeckIconDark,
  GridsomeIconDark,
  QuasarIconDark,
  SapperIconDark,
  JavaScriptIconDark,
  VuePressIconDark,
  UnibitIconDark,
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

export type ReturnedIcon = React.SFC<{
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}>;

export default function getIcon(theme: TemplateType): ReturnedIcon {
  switch (theme) {
    case adonis.name:
      return AdonisIconDark;
    case react.name:
      return ReactIconDark;
    case vue.name:
      return VueIconDark;
    case preact.name:
      return PreactIconDark;
    case reactTs.name:
      return ReactIconDark;
    case svelte.name:
      return SvelteIconDark;
    case angular.name:
      return AngularIconDark;
    case parcel.name:
      return JavaScriptIconDark;
    case dojo.name:
      return DojoIconDark;
    case ember.name:
      return EmberIconDark;
    case sapper.name:
      return SapperIconDark;
    case cxjs.name:
      return CxJSIconDark;
    case reason.name:
      return ReasonIconDark;
    case gatsby.name:
      return GatsbyIconDark;
    case marko.name:
      return MarkoIconDark;
    case next.name:
      return NextIconDark;
    case nuxt.name:
      return NuxtIconDark;
    case node.name:
      return NodeIconDark;
    case apollo.name:
      return ApolloIconDark;
    case nest.name:
      return NestIconDark;
    case staticTemplate.name:
      return HTML5IconDark;
    case styleguidist.name:
      return StyleguidistIconDark;
    case gridsome.name:
      return GridsomeIconDark;
    case vuepress.name:
      return VuePressIconDark;
    case mdxDeck.name:
      return MDXDeckIconDark;
    case quasar.name:
      return QuasarIconDark;
    case unibit.name:
      return UnibitIconDark;
    default:
      return ReactIconDark;
  }
}
