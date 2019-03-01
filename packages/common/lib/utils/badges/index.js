'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/* @flow */
const patron_4_svg_1 = require('./svg/patron-4.svg');
const patron_3_svg_1 = require('./svg/patron-3.svg');
const patron_2_svg_1 = require('./svg/patron-2.svg');
const patron_1_svg_1 = require('./svg/patron-1.svg');
function getBadge(badgeId) {
  if (badgeId === 'patron_4') return patron_4_svg_1.default;
  if (badgeId === 'patron_3') return patron_3_svg_1.default;
  if (badgeId === 'patron_2') return patron_2_svg_1.default;
  if (badgeId === 'patron_1') return patron_1_svg_1.default;
  return '';
}
exports.default = getBadge;
