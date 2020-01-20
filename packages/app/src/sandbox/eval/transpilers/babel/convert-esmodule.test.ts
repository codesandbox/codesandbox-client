import { convertEsModule } from './convert-esmodule';

describe('convert-esmodule', () => {
  it('can convert reexports', () => {
    const code = `
      export * from './test/store.js';
    `;
    expect(convertEsModule('/index.js', code)).toMatchSnapshot();
  });

  it('can convert normal exports', () => {
    const code = `
      export { test, test2 } from './test/store.js';
    `;
    expect(convertEsModule('/index.js', code)).toMatchSnapshot();
  });

  it('can convert function exports', () => {
    const code = `
      export function test() {}
      export const test2 = () => {}
      export class Test {}
    `;
    expect(convertEsModule('/index.js', code)).toMatchSnapshot();
  });

  it('can convert default exports', () => {
    const code = `
      export default function test() {}
    `;
    expect(convertEsModule('/index.js', code)).toMatchSnapshot();
  });

  it('can convert class default exports', () => {
    const code = `
      export default class A {}
    `;
    expect(convertEsModule('/index.js', code)).toMatchSnapshot();
  });

  it('can convert weird default exports', () => {
    const code = `
      export default a = 'b';
    `;
    expect(convertEsModule('/index.js', code)).toMatchSnapshot();
  });

  it('can convert default imports', () => {
    const code = `
      import a from './b';
    `;
    expect(convertEsModule('/index.js', code)).toMatchSnapshot();
  });

  it('can convert named imports', () => {
    const code = `
      import {a, b, c} from './b';
    `;
    expect(convertEsModule('/index.js', code)).toMatchSnapshot();
  });

  it('can handle as imports', () => {
    const code = `
      import { a as b } from './b';
    `;
    expect(convertEsModule('/index.js', code)).toMatchSnapshot();
  });
});
