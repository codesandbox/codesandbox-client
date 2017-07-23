function getParser(mode) {
  if (mode === 'jsx') return 'babylon';
  if (mode === 'css') return 'postcss';

  return 'babylon';
}

export const DEFAULT_PRETTIER_CONFIG = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: 'none',
  bracketSpacing: true,
  jsxBracketSameLine: false,
};

export default (async function prettify(
  code,
  mode,
  eslintEnabled,
  prettierConfig = DEFAULT_PRETTIER_CONFIG,
) {
  const prettier = await System.import('custom-prettier-codesandbox');
  const prettifiedCode = prettier.format(code, {
    ...DEFAULT_PRETTIER_CONFIG,
    ...prettierConfig,
    parser: getParser(mode),
  });

  if (eslintEnabled && mode === 'jsx') {
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
