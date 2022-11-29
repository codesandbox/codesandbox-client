import { SFCBlock, SFCDescriptor } from 'vue3-browser-compiler';
import { ParsedUrlQuery } from 'querystring';
import { TranspilerResult } from 'sandpack-core';

function convertSourceMapToInline(
  sourceMap: SFCBlock['map'] | undefined,
  prefix = '//#',
  postfix = ''
) {
  if (!sourceMap) {
    return '';
  }

  return `\n${prefix} sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(
    JSON.stringify(sourceMap),
    'utf-8'
  ).toString('base64')}${postfix}`;
}

export function selectBlock(
  descriptor: SFCDescriptor,
  query: ParsedUrlQuery
): TranspilerResult {
  // template
  if (query.type === `template`) {
    // if we are receiving a query with type it can only come from a *.vue file
    // that contains that block, so the block is guaranteed to exist.
    const template = descriptor.template!;

    // Deletion `template` tag
    if (!template) {
      return { transpiledCode: '' };
    }

    return {
      transpiledCode: template.content,
      sourceMap: template.map,
    };
  }

  // script
  if (query.type === `script`) {
    // FIXME: #1723
    // I still don't know when & why `scriptCompiled` would be empty
    // need to work out a better fix later
    const script = (descriptor as any).scriptCompiled || descriptor.script;

    // Deletion `script` tag
    if (!script) {
      return { transpiledCode: '' };
    }

    return {
      transpiledCode: script.content + convertSourceMapToInline(script.map),
      sourceMap: script.map,
    };
  }

  // styles
  if (query.type === `style` && query.index != null) {
    const style = descriptor.styles[Number(query.index)];

    // Deletion `style` tag
    if (!style) {
      return { transpiledCode: '' };
    }

    return {
      transpiledCode:
        style.content + convertSourceMapToInline(style.map, '/*#', '*/'),
      sourceMap: style.map,
    };
  }

  // custom
  if (query.type === 'custom' && query.index != null) {
    const block = descriptor.customBlocks[Number(query.index)];

    return { transpiledCode: block.content, sourceMap: block.map };
  }

  return { transpiledCode: '' };
}
