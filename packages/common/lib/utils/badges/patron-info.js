'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const patron_1_svg_1 = require('./svg/patron-1.svg');
const patron_2_svg_1 = require('./svg/patron-2.svg');
const patron_3_svg_1 = require('./svg/patron-3.svg');
const patron_4_svg_1 = require('./svg/patron-4.svg');
const info = {
  'patron-1': {
    Badge: patron_1_svg_1.default,
    particleCount: 10,
    colors: ['#1BB978'],
  },
  'patron-2': {
    Badge: patron_2_svg_1.default,
    particleCount: 20,
    colors: ['#B53D3D', '#1BB978'],
  },
  'patron-3': {
    Badge: patron_3_svg_1.default,
    particleCount: 35,
    colors: ['#609AC3', '#1BB978', '#B53D3D'],
  },
  'patron-4': {
    Badge: patron_4_svg_1.default,
    particleCount: 100,
    colors: ['#D0AF72', '#1BB978', '#B53D3D', '#609AC3'],
  },
};
// Preload the images
Object.keys(info).forEach(badge => {
  new Image().src = info[badge].Badge;
});
exports.default = info;
