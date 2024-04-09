import { collectDependenciesFromAST } from './collect-dependencies';
import { convertEsModule as convert } from './convert-esmodule';
import { generateCode, parseModule } from './utils';

function convertEsModule(code: string) {
  const ast = parseModule(code);
  convert(ast);
  const result = {
    code: generateCode(ast),
  };
  return result;
}

describe('convert-esmodule', () => {
  it('can convert reexports', () => {
    const code = `
      export * from './test/store.js';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert normal exports', () => {
    const code = `
      export { test, test2 } from './test/store.js';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert function exports', () => {
    const code = `
      export function test() {}
      export const test2 = () => {}
      export class Test {}
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert imports with spaces', () => {
    const code = `
      import aTest from 'a test';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert default exports', () => {
    const code = `
      export default function test() {}
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert class default exports', () => {
    const code = `
      export default class A {}
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert weird default exports', () => {
    const code = `
      export default a = 'b';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert default imports', () => {
    const code = `
      import a from './b';

      a();
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert named imports', () => {
    const code = `
      import {a, b, c} from './b';

      a();
      b();
      c();
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert named imports with different scopes', () => {
    const code = `
      import {a} from './b';

      a();

      function test1() {
        a();
      }
      function test2(a) {
        a();

        function test3() {
          a();
        }
      }
    `;

    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can handle as imports', () => {
    const code = `
      import { a as b } from './b';

      const func = b();
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('ignores comments', () => {
    const code = `
      // import { a as b } from './b';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can handle inline comments', () => {
    const code = `
      import { a as b, /* HELLO WORLD */ c } from './b';

      b();
      c();
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can handle class properties', () => {
    const code = `
      import T from './test';
      class T2 {
        a = () => {
          return 'test'
        }
        b = ''
        c = {}
        static d = ''
      }
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can handle async code', () => {
    const code = `
      import T from './test';
      async () => {
        const test = await test2()
      }
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can handle block scopes', () => {
    const code = `
    import{makeRect as t,getOppositeSide as e,getCollisions as n}from"@interop-ui/utils";

    if (true) {
      let e = c;
    }
    e();

    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles export mutations', () => {
    const code = `
      export default function test() {}

      test = 5;
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles export mutations with no named function', () => {
    const code = `
      export default function() {}
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles export mutations with variables', () => {
    const code = `
    export var to;

    function assign() {
      to = "test"
    }

    function assign2(to) {
      to = "test"
    }
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it("doesn't remove object initializers", () => {
    const code = `
    import { defineHidden, is, createInterpolator, each, getFluidConfig, isAnimatedString, useForceUpdate } from '@react-spring/shared';

    const createHost = (components, {
      a = () => {}
    } = {}) => {
     is()
    };
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it("doesn't set var definitions", () => {
    const code = `
    export var global = typeof window !== 'undefined' ? window : {};
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles default as exports', () => {
    const code = `
    export { default as Field } from './Field';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles named exports', () => {
    const code = `
    const a = 'c';
    export { a };
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles re-exports in named exports', () => {
    const code = `
    import { a } from './b';
    export { a };
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('generates parseable var name with @', () => {
    const code = `
    import { a } from './a-@kjaw';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles concurrent import and exports', () => {
    const code = `
    import { a as _a, b, c } from 'test-lib-dom';
    export * from 'test-lib-dom';

    var a = () => _a;
    export { a };
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles re-exports in named exports with a alias', () => {
    const code = `
    import { a } from './b';
    const c = 'test';
    export { a as b, c };
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles default imports', () => {
    const code = `
    import * as React from 'react';

    console.log(React.Component);
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles multiple var exports', () => {
    const code = `
    export const a = 5, b = 6;
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles multiple aliased exports', () => {
    const code = `
    export { _getArrayObserver as getArrayObserver, a as b };
    export { _getMapObserver as getMapObserver, c as d };
    export { _getSetObserver as getSetObserver, e as f };

    f.test();
    d.test();
    b.test();
    `;

    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('converts object shorthands', () => {
    const code = `
    import { templateFactory } from './template-factory.js';

    const short = { templateFactory };
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('hoists imports at bottom', () => {
    const code = `
    const a = PropTypes.a;

    import PropTypes from 'prop-types';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('works with variables that are named exports', () => {
    const code = `
    var exports = [eventedState, eventedShowHideState];
    exports.push('test');
    export default exports;
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('exports that are not on the root scope are not renamed', () => {
    const code = `
    function a() {
      var exports = 'blaat';
    }
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('renames exports that are already defined, even in block scope', () => {
    const code = `
    var exports = 'testtest';
    function a() {
      exports = 'blaat';
    }
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('does empty exports', () => {
    const code = `
    export {} from './column_sorting_draggable';
    export { EuiDataGrid } from './data_grid';
    export * from './data_grid_types';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('changes default imports inline', () => {
    const code = `
    import rgb from './rgb';

    rgb.a;
    `;

    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('keeps import order', () => {
    const code = `
    import '1';
    import '2';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('parses and writes chars with linebreaks', () => {
    const code =
      "var WS_CHARS = 'u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff'";
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('Has good performance', () => {
    /* eslint-disable */
    const code = require('./big-file');
    for (let i = 0; i < 5; i++) {
      const t = Date.now();
      const ast = parseModule(code);
      convert(ast);
      collectDependenciesFromAST(ast);
      console.log(`Converting ESM to CommonJS took: ${Date.now() - t}ms`);
    }
    /* eslint-enable */
  });

  it('handles import statement after default export', () => {
    const code = `
    export default function defaultOverscanIndicesGetter(_ref) {
    }

    import { bpfrpt_proptype_OverscanIndicesGetterParams } from './types';
    `;

    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles assignments and exports at the same time', () => {
    const code = `
    export const {Ease: C, Linear, Power0, Power1, Power2, Power3, Power4, TweenPlugin} = _gsScope;
    `;

    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles export object', () => {
    const code = `
    export {a, b, c};
    `;

    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('handles export alias', () => {
    const code = `
    export {Subscription as default};
    `;

    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('can convert exports containing overlapping exports', () => {
    const code = `
      export * from './some.js';
      export { default as some } from './some.js';
    `;
    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  // TODO: We should probably also have asyncDeps in the result?
  it('can convert import expressions', () => {
    const code = `
    import('test');
    `;

    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('defines its exports before requires', () => {
    const code = `
    import { COLORS } from './colors-values';

    export function get() {
      return 5;
    }
    `;

    expect(convertEsModule(code).code).toMatchSnapshot();
  });

  it('retains the order of re-exports', () => {
    const code = `
    export * from '@tensorflow/tfjs-core';
    import * as data2 from '@tensorflow/tfjs-test';
    export * from '@tensorflow/tfjs-layers';
    export * from '@tensorflow/tfjs-converter';
    // Export data api as tf.data
    import * as data from '@tensorflow/tfjs-data';
    export { data };
    `;

    const result = convertEsModule(code);
    expect(result.code).toMatchSnapshot();
    expect(result.code.indexOf('tfjs-core')).toBeLessThan(
      result.code.indexOf('tfjs-data')
    );
    expect(result.code.indexOf('tfjs-core')).toBeLessThan(
      result.code.indexOf('tfjs-layers')
    );
  });

  it("doesn't hoist single import above export", () => {
    const code = `
    export * from '@tensorflow/tfjs-core';
    import * as data from '@tensorflow/tfjs-data';
    `;

    const result = convertEsModule(code).code;
    expect(result).toMatchSnapshot();
    expect(result.indexOf('tfjs-core')).toBeLessThan(
      result.indexOf('tfjs-data')
    );
  });

  it('keeps function under hoisted import', () => {
    const code = `
    function a() {
      return data.test
    }
    export * from '@tensorflow/tfjs-core';
    import * as data from '@tensorflow/tfjs-data';
    `;

    const result = convertEsModule(code).code;
    expect(result.indexOf('function a')).toBeGreaterThan(
      result.indexOf('tfjs-data')
    );
    expect(result.indexOf('tfjs-core')).toBeLessThan(
      result.indexOf('tfjs-data')
    );
  });

  it('hoists exports as well', () => {
    const code = `
      function a() {
        return 5;
      }

      export { c } from './a';
      export * as data from './b';
    `;
    const result = convertEsModule(code).code;
    expect(result).toMatchSnapshot();
    expect(result.indexOf('function a')).toBeGreaterThan(result.indexOf('./a'));
    expect(result.indexOf('function a')).toBeGreaterThan(result.indexOf('./b'));
  });

  it('keeps star exports after default export order', () => {
    const code = `
    export { default as withSearch } from "./withSearch";
    export { default as WithSearch } from "./WithSearch";
    export { a } from './test';
    export * from "./containers";
    `;
    const result = convertEsModule(code).code;
    expect(result).toMatchSnapshot();
    expect(result.indexOf('./containers')).toBeGreaterThan(
      result.indexOf('./withSearch')
    );
  });

  it('hoists function exports', () => {
    const code = `
    export { test, test2 } from './test/store.js';

export function test3() {
}
    `;

    const result = convertEsModule(code).code;
    expect(result).toMatchSnapshot();
  });

  it('retains import orders with re-exports', () => {
    const code = `
    import * as _TypeChecker from './propTypeChecker';
    export { _TypeChecker as TypeChecker, _Kikker as Kikker };

    export { default as getDataGroupBy } from './getDataGroupBy';

    `;

    const result = convertEsModule(code).code;
    expect(result).toMatchSnapshot();
  });

  it('predefines possible exports', () => {
    const code = `
      export const a = 5;
      export function b() {};
      export class c {};
      const d = 5;
      const e = 5;
      export { d, e as e1 };
      export const { f, g: bah } = b();
      export default function h() {};
      export default class i {};
      export { j } from './foo';
      export { k as l } from './foo';
      export { m as default } from './foo';
    `;
    const result = convertEsModule(code).code;
    expect(result).toMatchSnapshot();
  });

  it('can do array exports', () => {
    const code = `
    function a() {
      return [1, 2];
    }

    export const [x, y] = a();
    `;

    const result = convertEsModule(code).code;
    expect(result).toMatchSnapshot();
  });

  it.skip('can do -- assigns', () => {
    const code = `
    export var character = 0
    export var characters = ''
    export var position = 0
    /**
     * @return {number}
     */
    export function prev () {
      character = position > 0 ? charat(characters, --position) : 0

      if (column--, character === 10)
        column = 1, line--

      return character
    }
    `;

    const result = convertEsModule(code).code;
    expect(result).toMatchSnapshot();
  });
});
