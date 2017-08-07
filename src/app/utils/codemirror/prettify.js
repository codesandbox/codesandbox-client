import prettier from 'custom-prettier-codesandbox';
import babylonParser from 'custom-prettier-codesandbox/parser-babylon';
import cssParser from 'custom-prettier-codesandbox/parser-postcss';

import { DEFAULT_PRETTIER_CONFIG } from 'app/store/preferences/reducer';

function getParser(mode) {
  if (mode === 'jsx') return babylonParser;
  if (mode === 'css') return cssParser;

  return babylonParser;
}

export default (async function prettify(
  code,
  mode,
  eslintEnabled,
  prettierConfig = DEFAULT_PRETTIER_CONFIG,
) {
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
