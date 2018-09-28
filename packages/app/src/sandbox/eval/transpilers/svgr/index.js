// @flow
// import h2x from '@svgr/core/lib/plugins/h2x';
import transform from '@svgr/core/lib/plugins/transform';
import { expandState } from '@svgr/core/lib/util';
import removeStylePlugin from '@svgr/core/lib/h2x/removeStyle';
import stripAttribute from '@svgr/core/lib/h2x/stripAttribute';
import removeComments from '@svgr/core/lib/h2x/removeComments';
import expandProps from '@svgr/core/lib/h2x/expandProps';

import { transform as h2xTransform } from 'h2x-core';
import h2xPluginJsx from 'h2x-plugin-jsx';

import Transpiler from '../';
import type { LoaderContext } from '../../../eval/transpiled-module';

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

async function svgrTransform(code: string, usedState) {
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

class SVGRTranspiler extends Transpiler {
  async doTranspilation(code: string, loaderContext: LoaderContext) {
    // We follow CRA behaviour, so the code with the component is not the default
    // export, this forces that.
    const state = {
      webpack: {
        previousExport: `"${loaderContext._module.module.path}"`,
      },
    };
    const result = await svgrTransform(code, state);

    return {
      transpiledCode: result,
    };
  }
}

const transpiler = new SVGRTranspiler('svgr-loader');

export { SVGRTranspiler };

export default transpiler;
