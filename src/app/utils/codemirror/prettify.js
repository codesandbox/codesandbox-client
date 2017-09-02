import { DEFAULT_PRETTIER_CONFIG } from 'app/store/preferences/reducer';

const worker = new Worker('/static/js/prettier/worker.js');

function getParser(mode) {
  if (mode === 'jsx') return 'babylon';
  if (mode === 'css') return 'postcss';
  if (mode === 'html') return 'parse5';
  if (mode === 'ts') return 'typescript';
  if (mode === 'graphql') return 'graphql';

  return 'babylon';
}

export default (function prettify(
  code,
  mode,
  eslintEnabled,
  prettierConfig = DEFAULT_PRETTIER_CONFIG
) {
  return new Promise(resolve => {
    worker.postMessage({
      text: code,
      options: {
        ...DEFAULT_PRETTIER_CONFIG,
        ...prettierConfig,
        parser: getParser(mode),
      },
    });

    worker.onmessage = e => {
      const { formatted, text, error } = e.data;
      if (error) {
        console.error(error);
        resolve(text);
      }
      if (formatted) {
        resolve(formatted);
      }
    };
  });
});
