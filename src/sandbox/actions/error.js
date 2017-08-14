// @flow
import type { ErrorRecord } from '../react-error-overlay/utils/errorRegister';
import { getCompiledModuleByPath } from '../eval/js';

function buildErrorMessage(e) {
  const title = e.name;
  const message = e.message;
  let line = null;
  let column = null;
  if (!e.hideLine) {
    // Safari
    if (e.line != null) {
      line = e.line;

      // FF
    } else if (e.lineNumber != null) {
      line = e.lineNumber;

      // Chrome
    } else if (e.stack) {
      const matched = e.stack.match(/<anonymous>:(\d+):(\d+)/);
      if (matched) {
        line = matched[1];
        column = matched[2];
      } else {
        // Maybe it's a babel transpiler error
        const babelMatched = e.stack.match(/(\d+):(\d+)/);
        if (babelMatched) {
          line = babelMatched[1];
          column = babelMatched[2];
        }
      }
    }
  }

  return {
    moduleId: e.module ? e.module.id : e.moduleId,
    title,
    message,
    line: parseInt(line, 10),
    column: parseInt(column, 10),
    payload: e.payload || {},
    severity: e.severity || 'error',
  };
}

/* eslint-disable no-underscore-dangle */
export function showError(ref: ErrorRecord) {
  const relevantFrame = ref.enhancedFrames.find(
    r => !!getCompiledModuleByPath(r._originalFileName || r.fileName),
  );

  if (relevantFrame) {
    const fileName = relevantFrame._originalFileName || relevantFrame.fileName;
    const module = getCompiledModuleByPath(fileName);

    if (module) {
      return {
        type: 'action',
        action: 'show-error',
        moduleId: module.id,
        title: ref.error.name,
        message: ref.error.message,
        line: relevantFrame._originalLineNumber,
        column: relevantFrame._originalColumnNumber,
        payload: {},
        severity: 'error',
      };
    }
  } else {
    const error = ref.error;
    const module = error.module;

    if (module) {
      return {
        ...buildErrorMessage(error),
        type: 'action',
        action: 'show-error',
      };
    }
  }

  return null;
}
