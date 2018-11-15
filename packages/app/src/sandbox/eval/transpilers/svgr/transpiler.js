import transform from '@svgr/core/lib/plugins/transform';
import { expandState } from '@svgr/core/lib/util';
import removeStylePlugin from '@svgr/core/lib/h2x/removeStyle';
import stripAttribute from '@svgr/core/lib/h2x/stripAttribute';
import removeComments from '@svgr/core/lib/h2x/removeComments';
import expandProps from '@svgr/core/lib/h2x/expandProps';

import { transform as h2xTransform } from 'h2x-core';
import h2xPluginJsx from 'h2x-plugin-jsx';

const DEFAULT_CONFIG = {
  h2xConfig: null,
  dimensions: true,
  expandProps: true,
  icon: false,
  native: false,
  prettier: true,
  prettierConfig: null,
  ref: false,
  replaceAttrValues: null,
  svgAttributes: null,
  svgProps: null,
  svgo: true,
  svgoConfig: null,
  template: null,
  titleProp: false,
};

export async function svgrTransform(code: string, usedState) {
  const config = { ...DEFAULT_CONFIG, ...{} };
  const state = expandState(usedState);
  let result = code;
  const plugins = [
    h2xPluginJsx,
    stripAttribute('xmlns'),
    removeComments(),
    removeStylePlugin(),
    expandProps('end'),
  ];
  // Remove null-byte character (copy/paste from Illustrator)
  result = String(result).replace('\0', '');
  result = h2xTransform(code, { plugins, state });
  result = await transform(result, config, state);
  return result;
}
