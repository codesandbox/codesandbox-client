import { getSyntaxInfoFromAst } from './syntax-info';
import { parseModule } from './utils';

describe('syntax info', () => {
  it('can detect jsx', () => {
    const code = `const a = <div>Hello</div>`;
    const ast = parseModule(code);
    const syntaxInfo = getSyntaxInfoFromAst(ast);
    expect(syntaxInfo.jsx).toBeTruthy();
    expect(syntaxInfo.esm).toBeFalsy();
  });

  it('can detect non jsx', () => {
    const code = `const a = /<div>Hello<\\/div>/`;
    const ast = parseModule(code);
    const syntaxInfo = getSyntaxInfoFromAst(ast);
    expect(syntaxInfo.jsx).toBeFalsy();
    expect(syntaxInfo.esm).toBeFalsy();
  });

  it('detects ESModules', () => {
    const code = `import * as React from 'react';\nconst a = <div>Hello</div>`;
    const ast = parseModule(code);
    const syntaxInfo = getSyntaxInfoFromAst(ast);
    expect(syntaxInfo.jsx).toBeTruthy();
    expect(syntaxInfo.esm).toBeTruthy();
  });

  it('detects ESModules', () => {
    const code = `export const a = "something";`;
    const ast = parseModule(code);
    const syntaxInfo = getSyntaxInfoFromAst(ast);
    expect(syntaxInfo.jsx).toBeFalsy();
    expect(syntaxInfo.esm).toBeTruthy();
  });
});
