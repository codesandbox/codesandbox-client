// @flow
import mdx from '@mdx-js/mdx';
import visit from 'unist-util-visit';

import { basename } from 'path';

import Transpiler from '../';
import { type LoaderContext } from '../../transpiled-module';

class MDXTranspiler extends Transpiler {
  doTranspilation(code: string, loaderContext: LoaderContext) {
    let evalId = 0;
    return mdx(code, {
      filepath: loaderContext.path,
      mdPlugins: [
        () => tree => {
          visit(tree, 'code', node => {
            const extension = node.lang || 'js';
            const tModule = loaderContext.emitModule(
              `${basename(loaderContext.path)}?eval${evalId++}.${extension}`,
              node.value
            );

            node.type = 'jsx';
            node.value = `<Evaluate code=${JSON.stringify(
              node.value
            )} moduleName="${tModule.module.path}" />`;
          });
        },
      ],
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
