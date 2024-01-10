import fetch from 'node-fetch';

import { parseModule } from './utils';
import { collectDependenciesFromAST } from './collect-dependencies';

function collectDependencies(code: string) {
  const ast = parseModule(code);
  const result = collectDependenciesFromAST(ast);
  return result;
}

describe('simple-get-require-statements', () => {
  it('finds a simple require statement', () => {
    const code = `require('test')`;

    expect(collectDependencies(code)).toStrictEqual(['test']);
  });

  it('finds multiple require statement', () => {
    const code = `require('test');
    require('test2')`;

    expect(collectDependencies(code)).toStrictEqual(['test', 'test2']);
  });

  it('ignores commented require statement', () => {
    const code = `require('test');
    // require('test2')`;

    expect(collectDependencies(code)).toStrictEqual(['test']);
  });

  it("doesn't ignore pure markers", () => {
    const code = `  /*#__PURE__*/ require('@emotion/stylis')`;

    expect(collectDependencies(code)).toStrictEqual(['@emotion/stylis']);
  });

  it('allow comments in require statement', () => {
    const code = `  /*#__PURE__*/ require(/*TYPE=ESM*/ '@emotion/stylis')`;

    expect(collectDependencies(code)).toStrictEqual(['@emotion/stylis']);
  });

  it('allows comment after require statement', () => {
    const code = `require('test');
    require('test2') // yes very nice`;

    expect(collectDependencies(code)).toStrictEqual(['test', 'test2']);
  });

  it('ignores second comment after require statement', () => {
    const code = `require('test');
    require('test2') // yes very nice require('nice')`;

    expect(collectDependencies(code)).toStrictEqual(['test', 'test2']);
  });

  it('ignores dependencies with no quotes', () => {
    const code = `require(test);`;

    expect(collectDependencies(code)).toStrictEqual([]);
  });

  it('handles a * that looks like a comment', () => {
    const code = `$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {})`;

    expect(collectDependencies(code)).toStrictEqual(['./_iter-detect']);
  });

  it('handles quotes in a require statement', () => {
    const code = `var $csb__Textareavue = require("!babel-loader!vue-template-loader!vue-loader?vue&type=template&id=d8507872&bindings={\\"modelValue\\":\\"props\\",\\"autoResize\\":\\"props\\",\\"resize\\":\\"options\\",\\"onInput\\":\\"options\\",\\"filled\\":\\"options\\"}!./Textarea.vue");`;

    expect(collectDependencies(code)).toStrictEqual([
      '!babel-loader!vue-template-loader!vue-loader?vue&type=template&id=d8507872&bindings={"modelValue":"props","autoResize":"props","resize":"options","onInput":"options","filled":"options"}!./Textarea.vue',
    ]);
  });

  it('Has good performance', async () => {
    const result = await fetch(
      'https://unpkg.com/react-dom@17.0.2/cjs/react-dom.development.js'
    );
    const code = await result.text();
    for (let i = 0; i < 5; i++) {
      const t = Date.now();
      collectDependencies(code);
      // eslint-disable-next-line no-console
      console.log(
        `Collecting CommonJS dependencies for react-dom took: ${
          Date.now() - t
        }ms`
      );
    }
  });
});
