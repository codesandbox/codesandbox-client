/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/
import hash from 'hash-sum';

import loaderUtils from 'sandpack-core/lib/transpiler/utils/loader-utils';
import type { LoaderContext } from 'sandpack-core/lib/transpiled-module';

// @ts-ignore
import addStylesClientRaw from '!raw-loader!./addStylesClient';
// @ts-ignore
import listToStylesRaw from '!raw-loader!./listToStyles';

const addStylesClientPath = '/node_modules/vue-style-loader/addStylesClient.js';
const listToStylesPath = '/node_modules/vue-style-loader/listToStyles.js';

export default async function (content: string, loaderContext: LoaderContext) {
  loaderContext.emitModule(
    addStylesClientPath,
    addStylesClientRaw,
    '/',
    false,
    false
  );
  loaderContext.emitModule(
    listToStylesPath,
    listToStylesRaw,
    '/',
    false,
    false
  );

  const request = loaderUtils.stringifyRequest(
    loaderContext,
    loaderContext._module.query.replace('vue-style-loader!', '') +
      '!' +
      loaderContext.path
  );

  await loaderContext.addDependency(JSON.parse(request));

  const id = JSON.stringify(hash(request));
  const code = [
    '// style-loader: Adds some css to the DOM by adding a <style> tag',
    '',
    '// load the styles',
    `var content = require(${request})`,
    // content list format is [id, css, media, sourceMap]
    "if(typeof content === 'string') content = [[module.id, content, '']];",
    'if(content.locals) module.exports = content.locals;',
    '',
    '// add the styles to the DOM',
    `var update = require("${addStylesClientPath}")(${id}, content, false);`,
    '// Hot Module Replacement',
    'if(module.hot) {',
    ' // When the styles change, update the <style> tags',
    ' if(!content.locals) {',
    `   module.hot.accept(${request}, function() {`,
    `     var newContent = require(${request});`,
    "     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];",
    '     update(newContent);',
    '   });',
    ' }',
    ' // When the module is disposed, remove the <style> tags',
    ' module.hot.dispose(function() { update(); });',
    '}',
  ].join('\n');

  return code;
}
