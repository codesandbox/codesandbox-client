/* eslint-disable no-console */

import DEFAULT_PRETTIER_CONFIG from '@codesandbox/common/lib/prettify-default-config';

import {
  indexToLineAndColumn,
  lineAndColumnToIndex,
} from './monaco-index-converter';

function getMode(title: string) {
  if (/\.jsx?$/.test(title)) {
    return 'babel';
  }

  if (/\.tsx?$/.test(title)) {
    return 'typescript';
  }

  if (/\.css$/.test(title)) {
    return 'css';
  }

  if (/\.s[c|a]ss$/.test(title)) {
    return 'scss';
  }

  if (/\.less$/.test(title)) {
    return 'less';
  }

  if (/\.vue$/.test(title)) {
    return 'vue';
  }

  if (/\.gql$/.test(title)) {
    return 'graphql';
  }

  if (/\.html$/.test(title)) {
    return 'html';
  }

  if (/\.md$/.test(title)) {
    return 'markdown';
  }

  if (/\.mdx$/.test(title)) {
    return 'mdx';
  }

  if (/\.json$/.test(title)) {
    return 'json';
  }

  if (/\.component\.html$/.test(title)) {
    return 'angular';
  }

  return null;
}

export function canPrettify(title) {
  return !!getMode(title);
}

function getEditorInfo(prettierConfig) {
  const newConfig = { ...prettierConfig };
  const { fluid } = newConfig;
  delete newConfig.fluid;

  if (fluid && window.CSEditor && window.CSEditor.editor) {
    try {
      const layoutInfo = window.CSEditor.editor.getLayoutInfo();
      newConfig.printWidth = layoutInfo.viewportColumn;

      return newConfig;
    } catch (e) {
      // ignore
    }
  }

  return newConfig;
}

function getEditorCursorPos(getCode: () => string) {
  try {
    if (window.CSEditor && window.CSEditor.editor) {
      const editorCode = window.CSEditor.editor.getValue(1);
      const givenCode = getCode();

      if (editorCode === givenCode) {
        // Same code is open
        const pos = window.CSEditor.editor.cursor.getPosition();

        const lines = window.CSEditor.editor.getModel().getLinesContent();
        const index = lineAndColumnToIndex(lines, pos.lineNumber, pos.column);

        return index;
      }

      return undefined;
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Getting cursor pos for prettifying throwed:');
      console.warn(e);
    }
  }

  return undefined;
}

function applyNewCursorOffset(
  newIndex: number,
  newCode: string,
  getCode: () => string
) {
  try {
    if (window.CSEditor && window.CSEditor.editor) {
      const editorCode = window.CSEditor.editor.getValue(1);
      const givenCode = getCode();

      if (editorCode === givenCode) {
        const lines = newCode.split(/\r?\n/);
        const newPos = indexToLineAndColumn(lines, newIndex);

        window.CSEditor.editor.setPosition(newPos);
      }
    }
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Applying cursor pos for prettifying throwed:');
      console.warn(e);
    }
  }
}

let worker = null;

export default function prettify(
  title,
  getCode,
  prettierConfig = DEFAULT_PRETTIER_CONFIG,
  isCurrentModule = () => false,
  cancellationToken: {
    isCancellationRequested: boolean,
    onCancellationRequested: (cb: Function) => {},
  }
) {
  const mode = getMode(title);

  worker = worker || new Worker('/static/js/prettier/worker-2.0.5.js');

  return new Promise((resolve, reject) => {
    if (cancellationToken && cancellationToken.isCancellationRequested) {
      return;
    }
    if (!mode) {
      resolve(getCode());
      return;
    }

    const alteredConfig = getEditorInfo(prettierConfig);
    const cursorPos = isCurrentModule()
      ? getEditorCursorPos(getCode)
      : undefined;

    worker.postMessage({
      text: getCode(),
      options: {
        cursorOffset: cursorPos,
        ...DEFAULT_PRETTIER_CONFIG,
        ...alteredConfig,
        parser: mode,
      },
    });

    let handler;
    let timeout;
    if (!cancellationToken) {
      timeout = setTimeout(() => {
        // If worker doesn't respond in time
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ error: 'Prettify timeout' });
        timeout = null;
        worker.removeEventListener('message', handler);
      }, 5000);
    } else {
      cancellationToken.onCancellationRequested(() => {
        worker.removeEventListener('message', handler);
      });
    }

    handler = e => {
      const { result, text, error } = e.data;

      if (text === getCode()) {
        worker.removeEventListener('message', handler);
        clearTimeout(timeout);
        timeout = null;

        if (error) {
          console.error(error);
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ error });
        }

        if (result && result.formatted != null) {
          resolve(result.formatted);
        }

        // After code is applied
        if (
          result &&
          result.newCursorOffset &&
          isCurrentModule() &&
          result.formatted != null
        ) {
          const newCursorOffset = result.cursorOffset;
          requestAnimationFrame(() => {
            // After model code has changed
            applyNewCursorOffset(newCursorOffset, result.formatted, getCode);
          });
        }
      }
    };

    worker.addEventListener('message', handler);
  });
}
