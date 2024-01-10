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

  it('can detect jsx in exported class components', () => {
    const code = `export default class Collapsible extends Component {
      render() {
        return <div>Hello world</div>;
      }
    }`;

    const ast = parseModule(code);
    const syntaxInfo = getSyntaxInfoFromAst(ast);
    expect(syntaxInfo.jsx).toBeTruthy();
    expect(syntaxInfo.esm).toBeTruthy();
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

  it('Has good performance', () => {
    /* eslint-disable */
    const code = require('./big-file');
    const ast = parseModule(code);
    for (let i = 0; i < 5; i++) {
      const t = Date.now();
      getSyntaxInfoFromAst(ast);
      console.log(`Getting syntax info took: ${Date.now() - t}ms`);
    }
    /* eslint-enable */
  });
});
