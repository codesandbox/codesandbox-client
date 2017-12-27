// @flow
import path from 'path';

import Transpiler from '../../';
import { type LoaderContext } from '../../../transpiled-module';

import parse from '../parser';

class VueSelector extends Transpiler {
  constructor() {
    super('vue-selector');
  }
  doTranspilation(content: string, loaderContext: LoaderContext) {
    const query = loaderContext.options;
    const context = query.context;
    let filename = path.basename(loaderContext.path);
    filename =
      filename.substring(0, filename.lastIndexOf(path.extname(filename))) +
      '.vue';
    const sourceRoot = path.dirname(path.relative(context, loaderContext.path));
    const parts = parse(content, filename, false, sourceRoot, query.bustCache);
    let part = parts[query.type];
    if (Array.isArray(part)) {
      part = part[query.index];
    }
    return Promise.resolve({ transpiledCode: part.content });
  }
}

const transpiler = new VueSelector();

export { VueSelector };

export default transpiler;
