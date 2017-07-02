import evaller from './';

describe('eval', () => {
  // just evaluate if the right evallers are called
  describe('js', () => {
    test('default es exports', () => {
      const mainModule = {
        title: 'test.js',
        code: `
        export default 3;
      `,
      };

      expect(evaller(mainModule)).toEqual({ default: 3 });
    });

    test('multiple es exports', () => {
      const mainModule = {
        title: 'test.js',
        code: `
        export const a = 'b';
        export const b = 'c';
        export default 3;
      `,
      };

      expect(evaller(mainModule)).toEqual({ a: 'b', b: 'c', default: 3 });
    });

    test('node exports', () => {
      const mainModule = {
        title: 'test.js',
        code: `
        module.exports = 3;
      `,
      };

      expect(evaller(mainModule)).toEqual(3);
    });

    test('imports', () => {
      const mainModule = {
        title: 'test.js',
        shortid: '1',
        code: `
        export default require('./test2');
      `,
      };

      const secondModule = {
        title: 'test2.js',
        shortid: '2',
        code: `
        export default 3;
      `,
      };

      expect(evaller(mainModule, [mainModule, secondModule])).toEqual({
        default: 3,
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

    expect(evaller(mainModule)).toEqual(['.test']);
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
