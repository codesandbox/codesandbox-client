import path from 'path';

import loader from '.';
import TypeScriptCompileError from './Errors/TypeScriptCompileError';

const FIXTURES_PATH = path.resolve(__dirname, '__fixtures__');

describe('TypeScriptLoader', () => {
  it('compiles a valid TypeScript file', async () => {
    const result = await loader(path.resolve(FIXTURES_PATH, 'success'), '');
    expect(result).toEqual({ foo: 'bar' });
  });

  it('fails to compile an invalid TypeScript file', async () => {
    try {
      await loader(path.resolve(FIXTURES_PATH, 'error'), '');
    } catch (error) {
      expect(error).toBeInstanceOf(TypeScriptCompileError);
      expect(error.toObject().message).toMatch('Failed to compile TypeScript');
    }
  });
});
