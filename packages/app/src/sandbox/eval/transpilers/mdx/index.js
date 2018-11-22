// @flow
import mdx from '@mdx-js/mdx';

import Transpiler from '../';
import { type LoaderContext } from '../../transpiled-module';

class MDXTranspiler extends Transpiler {
  doTranspilation(code: string, loaderContext: LoaderContext) {
    return mdx(code, {
      filepath: loaderContext.path,
    }).then(result => ({
      transpiledCode: `import React from 'react';
import { MDXTag } from '@mdx-js/tag';

${result}`,
    }));
  }
}

const transpiler = new MDXTranspiler('mdx-loader');

export { MDXTranspiler };

export default transpiler;
