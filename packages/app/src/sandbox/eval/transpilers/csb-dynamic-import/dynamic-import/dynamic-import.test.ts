import { convertDynamicImport } from '.';

it('converts import expression', () => {
  const code = `import('test')`;

  expect(convertDynamicImport(code)).toMatchInlineSnapshot(
    `"$csbImport('test')"`
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

it('can convert quickly', () => {
  /* eslint-disable */
  const code = require('../convert-esmodule/big-file');

  const t = performance.now();

  for (let i = 0; i < 1; i++) {
    convertDynamicImport(code);
  }

  const time = performance.now() - t;
  console.log(time);
  /* eslint-enable */

  expect(time).toBeLessThan(10);
});
