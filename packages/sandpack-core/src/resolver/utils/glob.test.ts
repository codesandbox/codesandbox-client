import { replaceGlob } from './glob';

describe('glob utils', () => {
  it('replace glob at the end', () => {
    expect(
      replaceGlob('#test/*', './something/*/index.js', '#test/hello')
    ).toBe('./something/hello/index.js');
  });

  it('replaces glob and target at the end', () => {
    const input = replaceGlob(
      '/@test/foo/*',
      '/@test/foo/dist/*',
      '/@test/foo/dist/index'
    );
    expect(input).toBe('/@test/foo/dist/index');
  });

  it('replace glob in the middle', () => {
    expect(replaceGlob('#test/*.js', './test/*.js', '#test/hello.js')).toBe(
      './test/hello.js'
    );
  });
});
