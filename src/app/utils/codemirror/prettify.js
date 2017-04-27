export default (async function prettify(code, eslintEnabled) {
  const prettier = await System.import('prettier');
  const prettifiedCode = prettier.format(code, {
    singleQuote: true,
    trailingComma: 'all',
  });

  if (eslintEnabled) {
    const { fix } = await System.import('app/utils/codemirror/eslint-lint');
    try {
      const lintedCode = fix(prettifiedCode).output;

      // If linter can't parse, it will return an empty string. Unwanted, so fall
      // back to prettified code
      if (lintedCode) return lintedCode;
    } catch (e) {
      console.error(e);
    }
  }

  return prettifiedCode;
});
