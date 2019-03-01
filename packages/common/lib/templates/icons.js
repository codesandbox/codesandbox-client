'use strict';
// @flow
Object.defineProperty(exports, '__esModule', { value: true });
const React_1 = require('../components/logos/React');
const Angular_1 = require('../components/logos/Angular');
const Ember_1 = require('../components/logos/Ember');
const Parcel_1 = require('../components/logos/Parcel');
const Preact_1 = require('../components/logos/Preact');
const Vue_1 = require('../components/logos/Vue');
const Svelte_1 = require('../components/logos/Svelte');
const Sapper_1 = require('../components/logos/Sapper');
const Dojo_1 = require('../components/logos/Dojo');
const CxJS_1 = require('../components/logos/CxJS');
const Reason_1 = require('../components/logos/Reason');
const Gatsby_1 = require('../components/logos/Gatsby');
const Next_1 = require('../components/logos/Next');
const Nuxt_1 = require('../components/logos/Nuxt');
const Node_1 = require('../components/logos/Node');
const Apollo_1 = require('../components/logos/Apollo');
const Nest_1 = require('../components/logos/Nest');
const Static_1 = require('../components/logos/Static');
const Styleguidist_1 = require('../components/logos/Styleguidist');
const _1 = require('./');
function getIcon(theme) {
  switch (theme) {
    case _1.react.name:
      return React_1.default;
    case _1.vue.name:
      return Vue_1.default;
    case _1.preact.name:
      return Preact_1.default;
    case _1.reactTs.name:
      return React_1.default;
    case _1.svelte.name:
      return Svelte_1.default;
    case _1.angular.name:
      return Angular_1.default;
    case _1.parcel.name:
      return Parcel_1.default;
    case _1.dojo.name:
      return Dojo_1.default;
    case _1.ember.name:
      return Ember_1.default;
    case _1.sapper.name:
      return Sapper_1.default;
    case _1.cxjs.name:
      return CxJS_1.default;
    case _1.reason.name:
      return Reason_1.default;
    case _1.gatsby.name:
      return Gatsby_1.default;
    case _1.next.name:
      return Next_1.default;
    case _1.nuxt.name:
      return Nuxt_1.default;
    case _1.node.name:
      return Node_1.default;
    case _1.apollo.name:
      return Apollo_1.default;
    case _1.nest.name:
      return Nest_1.default;
    case _1.staticTemplate.name:
      return Static_1.default;
    case _1.styleguidist.name:
      return Styleguidist_1.default;
    default:
      return React_1.default;
  }
}
exports.default = getIcon;
