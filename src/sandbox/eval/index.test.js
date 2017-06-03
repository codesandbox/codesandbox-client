import evaller from './';

describe('eval', () => {
  // just evaluate if the right evallers are called
  test('js', () => {
    const mainModule = {
      title: 'test.js',
      code: `
        export default 3;
      `,
    };
    const modules = [mainModule];

    expect(evaller(mainModule, modules, [], {})).toEqual({
      __esModule: true,
      default: 3,
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
