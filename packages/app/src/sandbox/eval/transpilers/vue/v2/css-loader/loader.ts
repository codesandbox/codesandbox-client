import { LoaderContext } from 'sandpack-core/lib/transpiled-module';
// @ts-ignore
import CSSBaseRaw from '!raw-loader!./client/css-base';

import getModules from './get-modules';

const CSSBasePath = '/node_modules/css-loader/css-base.js';

const getStyleId = id => id + '-css'; // eslint-disable-line

export default function transpile(
  content: string,
  loaderContext: LoaderContext
) {
  loaderContext.emitModule(CSSBasePath, CSSBaseRaw, '/', false, false);

  let result = '';
  result += `exports = module.exports = require("${CSSBasePath}")(false);\n\n`;

  if (loaderContext.options.modules) {
    return getModules(content, loaderContext).then(({ css, exportTokens }) => {
      result += `exports.push([module.id, ${JSON.stringify(css)}, ""])\n\n`;
      result += `exports.locals = ${JSON.stringify(exportTokens)};`;

      return Promise.resolve({ transpiledCode: result });
    });
  }

  result += `exports.push([module.id, ${JSON.stringify(content)}, ""])`;

  return Promise.resolve({ transpiledCode: result });
}
