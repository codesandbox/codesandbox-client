import { SFCDescriptor } from 'vue3-browser-compiler';
import { ParsedUrlQuery } from 'querystring';
import { TranspilerResult } from 'app/src/sandbox/eval/transpilers';

export function selectBlock(
  descriptor: SFCDescriptor,
  query: ParsedUrlQuery
): TranspilerResult {
  // template
  if (query.type === `template`) {
    // if we are receiving a query with type it can only come from a *.vue file
    // that contains that block, so the block is guaranteed to exist.
    const template = descriptor.template!;

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

    return {
      transpiledCode: script.content,
      sourceMap: script.map,
    };
  }

  // styles
  if (query.type === `style` && query.index != null) {
    const style = descriptor.styles[Number(query.index)];

    return {
      transpiledCode: style.content,
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
