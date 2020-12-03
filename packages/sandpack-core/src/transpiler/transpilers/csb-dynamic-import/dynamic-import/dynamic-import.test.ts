import { convertDynamicImport } from '.';

it('converts import expression', () => {
  const code = `import('test')`;

  expect(convertDynamicImport(code)).toMatchInlineSnapshot(
    `" $csbImport('test')"`
  );
});

it('converts import expression with newline', () => {
  const code = `() => import(
    'test'
  )`;

  expect(convertDynamicImport(code)).toMatchInlineSnapshot(`
    "() => $csbImport(
        'test'
      )"
  `);
});

it("doesn't convert funcs with different import name", () => {
  const code = `__import(
    'test'
  )`;

  expect(convertDynamicImport(code)).toMatchInlineSnapshot(`
    "__import(
        'test'
      )"
  `);
});

it('can convert quickly', () => {
  /* eslint-disable */
  const code = require('./big-file').default;

  const t = performance.now();

  for (let i = 0; i < 1; i++) {
    convertDynamicImport(code);
  }

  const time = performance.now() - t;
  console.log('es-module-convert-time', time);
  /* eslint-enable */

  // expect(time).toBeLessThan(10);
});
