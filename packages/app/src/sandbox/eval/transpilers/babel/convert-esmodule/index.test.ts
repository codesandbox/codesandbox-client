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

  it('parses and writes chars with linebreaks', () => {
    const code =
      "var WS_CHARS = 'u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff'";
    expect(convertEsModule(code)).toMatchSnapshot();
  });

  it('has good perf', () => {
    /* eslint-disable */
    const code = require('./big-file');

    const t = Date.now();

    for (let i = 0; i < 1; i++) {
      convertEsModule(code);
    }
    console.log(Date.now() - t);
    /* eslint-enable */
  });
});
