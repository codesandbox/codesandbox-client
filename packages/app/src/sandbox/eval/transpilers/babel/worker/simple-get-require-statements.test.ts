import getRequireStatements from './simple-get-require-statements';

describe('simple-get-require-statements', () => {
  it('finds a simple require statement', () => {
    const code = `require('test')`;

    expect(getRequireStatements(code)).toStrictEqual([
      { type: 'direct', path: 'test' },
    ]);
  });

  it('finds multiple require statement', () => {
    const code = `require('test');
    require('test2')`;

    expect(getRequireStatements(code)).toStrictEqual([
      { type: 'direct', path: 'test' },
      { type: 'direct', path: 'test2' },
    ]);
  });

  it('ignores commented require statement', () => {
    const code = `require('test');
    // require('test2')`;

    expect(getRequireStatements(code)).toStrictEqual([
      { type: 'direct', path: 'test' },
    ]);
  });

  it("doesn't ignore pure markers", () => {
    const code = `  /*#__PURE__*/ require('@emotion/stylis')`;

    expect(getRequireStatements(code)).toStrictEqual([
      { type: 'direct', path: '@emotion/stylis' },
    ]);
  });

  it('allows comment after require statement', () => {
    const code = `require('test');
    require('test2') // yes very nice`;

    expect(getRequireStatements(code)).toStrictEqual([
      { type: 'direct', path: 'test' },
      { type: 'direct', path: 'test2' },
    ]);
  });

  it('ignores second comment after require statement', () => {
    const code = `require('test');
    require('test2') // yes very nice require('nice')`;

    expect(getRequireStatements(code)).toStrictEqual([
      { type: 'direct', path: 'test' },
      { type: 'direct', path: 'test2' },
    ]);
  });

  it('ignores dependencies with no quotes', () => {
    const code = `require(test);`;

    expect(getRequireStatements(code)).toStrictEqual([]);
  });

  it('handles a * that looks like a comment', () => {
    const code = `$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {`;

    expect(getRequireStatements(code)).toStrictEqual([
      { type: 'direct', path: './_iter-detect' },
    ]);
  });
});
