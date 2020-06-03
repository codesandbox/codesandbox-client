import { convertEsModule } from '.';

describe('convert-esmodule', () => {
  it('can convert reexports', () => {
    const code = `
      export * from './test/store.js';
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can convert normal exports', () => {
    const code = `
      export { test, test2 } from './test/store.js';
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can convert function exports', () => {
    const code = `
      export function test() {}
      export const test2 = () => {}
      export class Test {}
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can convert default exports', () => {
    const code = `
      export default function test() {}
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can convert class default exports', () => {
    const code = `
      export default class A {}
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can convert weird default exports', () => {
    const code = `
      export default a = 'b';
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can convert default imports', () => {
    const code = `
      import a from './b';
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can convert named imports', () => {
    const code = `
      import {a, b, c} from './b';

      a();
      b();
      c();
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
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

    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can handle as imports', () => {
    const code = `
      import { a as b } from './b';

      const func = b();
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('ignores comments', () => {
    const code = `
      // import { a as b } from './b';
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can handle inline comments', () => {
    const code = `
      import { a as b, /* HELLO WORLD */ c } from './b';

      b();
      c();
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
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
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('can handle async code', () => {
    const code = `
      import T from './test';
      async () => {
        const test = await test2()
      }
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('handles export mutations', () => {
    const code = `
      export default function test() {}

      test = 5;
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('handles export mutations with no named function', () => {
    const code = `
      export default function() {}
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
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
    expect(convertEsModule(code)).toMatchSnapshot();
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
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it("doesn't set var definitions", () => {
    const code = `
    export var global = typeof window !== 'undefined' ? window : {};
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('handles default as exports', () => {
    const code = `
    export { default as Field } from './Field';
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('handles named exports', () => {
    const code = `
    const a = 'c';
    export { a };
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('handles re-exports in named exports', () => {
    const code = `
    import { a } from './b';
    export { a };
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('handles re-exports in named exports with a alias', () => {
    const code = `
    import { a } from './b';
    const c = 'test';
    export { a as b, c };
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('handles default imports', () => {
    const code = `
    import * as React from 'react';

    console.log(React.Component);
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
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

    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('converts object shorthands', () => {
    const code = `
    import { templateFactory } from './template-factory.js';

    const short = { templateFactory };
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('hoists imports at bottom', () => {
    const code = `
    const a = PropTypes.a;

    import PropTypes from 'prop-types';
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('works with variables that are named exports', () => {
    const code = `
    var exports = [eventedState, eventedShowHideState];
    exports.push('test');
    export default exports;
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('exports that are not on the root scope are not renamed', () => {
    const code = `
    function a() {
      var exports = 'blaat';
    }
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('renames exports that are already defined, even in block scope', () => {
    const code = `
    var exports = 'testtest';
    function a() {
      exports = 'blaat';
    }
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('does empty exports', () => {
    const code = `
    export {} from './column_sorting_draggable';
    export { EuiDataGrid } from './data_grid';
    export * from './data_grid_types';
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('changes default imports inline', () => {
    const code = `
    import rgb from './rgb';

    rgb.a;
    `;

    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('keeps import order', () => {
    const code = `
    import '1';
    import '2';
    `;
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('parses and writes chars with linebreaks', () => {
    const code =
      "var WS_CHARS = 'u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff'";
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('has good perf', () => {
    /* eslint-disable */
    const code = require('./big-file');

    const t = Date.now();
    const n = 5;

    for (let i = 0; i < n; i++) {
      convertEsModule(code);
    }
    console.log((Date.now() - t) / n);
    /* eslint-enable */
  });

  it('handles import statement after default export', () => {
    const code = `
    export default function defaultOverscanIndicesGetter(_ref) {
    }

    import { bpfrpt_proptype_OverscanIndicesGetterParams } from './types';
    `;

    convertEsModule(code);
  });
});
