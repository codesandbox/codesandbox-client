import evaller from './';
import { clearCache } from './js';

describe('eval', () => {
  // just evaluate if the right evallers are called
  ['js', 'jsx'].forEach(jsExtension => {
    describe(jsExtension, () => {
      beforeEach(() => {
        clearCache();
      });

      test('default es exports', () => {
        const mainModule = {
          title: `test.${jsExtension}`,
          code: `export default 3;`,
        };

        expect(evaller(mainModule, [mainModule], [])).toEqual({ default: 3 });
      });

      test('multiple es exports', () => {
        const mainModule = {
          title: `test.${jsExtension}`,
          code: `
          export const a = 'b';
          export const b = 'c';
          export default 3;
        `,
        };

        expect(evaller(mainModule, [mainModule], [])).toEqual({
          a: 'b',
          b: 'c',
          default: 3,
        });
      });

      test('node exports', () => {
        const mainModule = {
          title: `test.${jsExtension}`,
          code: `
          module.exports = 3;
        `,
        };

        expect(evaller(mainModule, [mainModule], [])).toEqual(3);
      });

      test('imports', () => {
        const mainModule = {
          title: `test.${jsExtension}`,
          shortid: '1',
          code: `
          export default require('./test2');
        `,
        };

        const secondModule = {
          title: `test2.${jsExtension}`,
          shortid: '2',
          code: `
          export default 3;
        `,
        };

        expect(evaller(mainModule, [mainModule, secondModule], [])).toEqual({
          default: { default: 3 },
        });
      });

      describe('cyclic dependencies', () => {
        it('returns an object as cyclic dependency', () => {
          const moduleA = {
            title: `a.${jsExtension}`,
            shortid: '1',
            code: `
          import b from './b';
          export default b;
        `,
          };

          const moduleB = {
            title: `b.${jsExtension}`,
            shortid: '2',
            code: `
          import a from './a';
          export default a;
        `,
          };

          expect(evaller(moduleA, [moduleA, moduleB], [])).toEqual({
            default: {},
          });
        });

        it('returns an object in deep cyclic dependency', () => {
          const moduleA = {
            title: `a.${jsExtension}`,
            shortid: '1',
            code: `
          import b from './b';
          export default b;
        `,
          };

          const moduleB = {
            title: `b.${jsExtension}`,
            shortid: '2',
            code: `
          import c from './c';
          export default c;
        `,
          };

          const moduleC = {
            title: `c.${jsExtension}`,
            shortid: '3',
            code: `
          import a from './a';
          export default a;
        `,
          };

          expect(evaller(moduleA, [moduleA, moduleB, moduleC], [])).toEqual({
            default: {},
          });
        });
      });

      describe.skip('custom babel config', () => {
        it('uses custom babel config', () => {
          const mainModule = {
            title: `test.${jsExtension}`,
            shortid: '1',
            code: `
            const a = {b: 'a'};
            const b = {a: 'b'};
          export default {...a, ...b};
        `,
          };

          const babelConfig = {
            title: '.babelrc',
            shortid: '2',
            code: `
          {
            "presets": ["es2015", "react", "stage-0"]
          }
        `,
          };

          expect(evaller(mainModule, [mainModule, babelConfig], [])).toEqual({
            default: { a: 'b', b: 'a' },
          });

          const emptyBabelConfig = {
            title: '.babelrc',
            shortid: '2',
            code: `
          {
            "presets": []
          }`,
          };

          expect(() =>
            evaller(mainModule, [mainModule, emptyBabelConfig], []),
          ).toThrow();
        });

        it('resolves to dependencies as plugins', () => {
          const mainModule = {
            title: `test.${jsExtension}`,
            shortid: '1',
            code: `
            const a = {b: 'a'};
            const b = {a: 'b'};
          export default {...a, ...b};
        `,
          };

          const babelConfig = {
            title: '.babelrc',
            shortid: '2',
            code: `
          {
            "presets": ["es2015", "react", "stage-0"],
            "plugins": ["emotion/babel"]
          }
        `,
          };

          expect(() =>
            evaller(mainModule, [mainModule, babelConfig], [], {}),
          ).toThrowError("Could not find dependency: 'emotion'");
        });

        it('can resolve plugins with options', () => {
          const mainModule = {
            title: `test.${jsExtension}`,
            shortid: '1',
            code: `
            const a = {b: 'a'};
            const b = {a: 'b'};
          export default {...a, ...b};
        `,
          };

          const babelConfig = {
            title: '.babelrc',
            shortid: '2',
            code: `
          {
            "presets": ["es2015", "react", "stage-0"],
            "plugins": [["emotion/babel", { "inline": true }]]
          }
        `,
          };

          expect(() =>
            evaller(mainModule, [mainModule, babelConfig], [], {}),
          ).toThrowError("Could not find dependency: 'emotion'");
        });
      });
    });
  });

  test('css', () => {
    const mainModule = {
      title: 'test.css',
      code: `
        .test {
          color: blue;
        }
      `,
    };

    expect(evaller(mainModule, [mainModule], [])).toEqual(['.test']);
  });

  test('html', () => {
    const mainModule = {
      title: 'test.html',
      code: `<div>Hello</div>`,
    };

    expect(evaller(mainModule)).toEqual(`<div>Hello</div>`);
  });

  test('json', () => {
    const mainModule = {
      title: 'test.json',
      code: `{"test":"test"}`,
    };

    expect(evaller(mainModule)).toEqual({ test: 'test' });
  });
});
