import DEFAULT_PRETTIER_CONFIG from 'common/prettify-default-config';

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
    return 'babylon';
  }

  if (/\.css$/.test(title)) {
    return 'postcss';
  }

  if (/\.s[c|a]ss$/.test(title)) {
    return 'postcss';
  }

  if (/\.less$/.test(title)) {
    return 'postcss';
  }

  if (/\.vue$/.test(title)) {
    return 'vue';
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
  getCode,
  prettierConfig = DEFAULT_PRETTIER_CONFIG
) {
  const mode = getMode(title);

  worker = worker || new Worker('/static/js/prettier/worker.js');

  return new Promise((resolve, reject) => {
    if (!mode) {
      reject({ error: 'No mode found for prettify' });
      return;
    }

    worker.postMessage({
      text: getCode(),
      options: {
        ...DEFAULT_PRETTIER_CONFIG,
        ...prettierConfig,
        parser: mode,
      },
    });

    let timeout = setTimeout(() => {
      // If worker doesn't respond in time
      reject({ error: 'Prettify timeout' });
      timeout = null;
    }, 5000);

    const handler = e => {
      const { formatted, text, error } = e.data;

      if (timeout) {
        if (text === getCode()) {
          worker.removeEventListener('message', handler);
          clearTimeout(timeout);
          timeout = null;

          if (error) {
            console.error(error);
            reject({ error });
          }

          if (formatted) {
            resolve(formatted);
          }
        }
      } else {
        worker.removeEventListener('message', handler);
      }
    };

    worker.addEventListener('message', handler);
  });
}
