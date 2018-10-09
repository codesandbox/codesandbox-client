/* eslint-disable no-console */

import DEFAULT_PRETTIER_CONFIG from 'common/prettify-default-config';
import {
  lineAndColumnToIndex,
  indexToLineAndColumn,
} from '../components/CodeEditor/Monaco/monaco-index-converter';

function getMode(title: string) {
  if (/\.jsx?$/.test(title)) {
    return 'babylon';
  }

  if (/\.tsx?$/.test(title)) {
    return 'typescript';
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

function getEditorInfo(prettierConfig) {
  const newConfig = { ...prettierConfig };
  const fluid = newConfig.fluid;
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
  isCurrentModule = () => false
) {
  const mode = getMode(title);

  worker = worker || new Worker('/static/js/prettier/worker.js');

  return new Promise((resolve, reject) => {
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

    let timeout = setTimeout(() => {
      // If worker doesn't respond in time
      reject({ error: 'Prettify timeout' });
      timeout = null;
    }, 5000);

    const handler = e => {
      const { result, text, error } = e.data;

      if (timeout) {
        if (text === getCode()) {
          worker.removeEventListener('message', handler);
          clearTimeout(timeout);
          timeout = null;

          if (error) {
            console.error(error);
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
      } else {
        worker.removeEventListener('message', handler);
      }
    };

    worker.addEventListener('message', handler);
  });
}
