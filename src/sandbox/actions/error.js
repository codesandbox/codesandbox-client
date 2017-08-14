// @flow
import type { ErrorRecord } from '../react-error-overlay/utils/errorRegister';
import { getCompiledModuleByPath } from '../eval/js';

/* eslint-disable no-underscore-dangle */
export function showError(ref: ErrorRecord) {
  const relevantFrame =
    ref.enhancedFrames.find(
      r => !!getCompiledModuleByPath(r._originalFileName || r.fileName),
    ) || ref[0];

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
  }

  return null;
}
