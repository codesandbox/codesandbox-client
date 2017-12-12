import { DEFAULT_PRETTIER_CONFIG } from 'app/store/preferences/reducer';

// function getParser(mode) {
//   if (mode === 'jsx') return 'babylon';
//   if (mode === 'json') return 'json';
//   if (mode === 'css') return 'postcss';
//   if (mode === 'html') return 'parse5';
//   if (mode === 'typescript') return 'typescript';
//   if (mode === 'graphql') return 'graphql';

//   return 'babylon';
// }

function getMode(title: string) {
  if (/\.jsx?$/.test(title)) {
    return 'babylon';
  }

  if (/\.tsx?$/.test(title)) {
    return 'typescript';
  }

  if (/\.json$/.test(title)) {
    return 'json';
  }

  if (/\.css$/.test(title)) {
    return 'postcss';
  }

  if (/\.scss$/.test(title)) {
    return 'postcss';
  }

  if (/\.less$/.test(title)) {
    return 'postcss';
  }

  if (/\.gql$/.test(title)) {
    return 'graphql';
  }

  return null;
}

export function canPrettify(title) {
  return !!getMode(title);
}

let worker = null;

export default function prettify(
  title,
  code,
  prettierConfig = DEFAULT_PRETTIER_CONFIG
) {
  const mode = getMode(title);

  worker = worker || new Worker('/static/js/prettier/worker.js');

  return new Promise(resolve => {
    if (!mode) {
      resolve(code);
      return;
    }

    worker.postMessage({
      text: code,
      options: {
        ...DEFAULT_PRETTIER_CONFIG,
        ...prettierConfig,
        parser: mode,
      },
    });

    let timeout = setTimeout(() => {
      // If worker doesn't respond in time
      resolve(code);
    }, 5000);

    worker.onmessage = e => {
      const { formatted, text, error } = e.data;
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
        if (text === code) {
          if (error) {
            console.error(error);
            resolve(text);
          }
          if (formatted) {
            resolve(formatted);
          } else {
            resolve(text);
          }
        }
      }
    };
  });
}
