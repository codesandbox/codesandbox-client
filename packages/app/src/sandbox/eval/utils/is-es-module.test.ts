import isESModule from './is-es-module';

describe('is-es-module', () => {
  it('works with import', () => {
    const code = `import a from 'a'`;
    expect(isESModule(code)).toBe(true);
  });

  it('works with export', () => {
    const code = `export a from 'a'`;
    expect(isESModule(code)).toBe(true);
  });

  it('works with .import', () => {
    const code = `const test.import = 'test'`;
    expect(isESModule(code)).toBe(false);
  });

  it('handles exports that are not at the start of the line', () => {
    const code = `function r(r){var t=r&&r.pop?[]:{};for(var n in r)t[n]=r[n];return t}export default function(t,n,l){n.split&&(n=n.split("."));for(var o=r(t),a=o,e=0,f=n.length;e<f;e++)a=a[n[e]]=e===f-1?l&&l.call?l(a[n[e]]):l:r(a[n[e]]);return o}`;
    expect(isESModule(code)).toBe(true);
  });

  // Breaks randomly
  // it('is fast', () => {
  //   let code = '';
  //   for (let i = 0; i < 10000; i++) {
  //     code += "\nexport { test, a, b } from './test';\nimport a from './test';";
  //   }
  //   const start = performance.now();
  //   expect(isESModule(code)).toBe(true);
  //   const time = performance.now() - start;
  //   expect(time).toBeLessThan(10);
  // });
});
