import { rewriteImportMeta } from './rewrite-meta';
import { generateCode, parseModule } from './utils';

describe('Rewrite import.meta', () => {
  it('Can detect and rewrite import.meta to $csb__import_meta', () => {
    const code = `const a = import.meta.url;`;
    const ast = parseModule(code);
    rewriteImportMeta(ast, {
      url: 'https://csb.io/index.js',
    });
    const result = generateCode(ast);
    expect(result).toMatchSnapshot();
  });

  it('Should not add a global $csb__import_meta when there is no need for it', () => {
    const code = `const a = "hello";`;
    const ast = parseModule(code);
    rewriteImportMeta(ast, {
      url: 'https://csb.io/index.js',
    });
    const result = generateCode(ast);
    expect(result).toMatchSnapshot();
  });
});
