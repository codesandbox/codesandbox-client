/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { registerUnhandledError } from './effects/unhandledError';
import { registerUnhandledRejection } from './effects/unhandledRejection';
import { registerStackTraceLimit } from './effects/stackTraceLimit';
import {
  permanentRegister as permanentRegisterConsole,
  registerReactStack,
} from './effects/proxyConsole';
import { massage as massageWarning } from './utils/warnings';
import { getStackFrames } from './utils/getStackFrames';

import type { StackFrame } from './utils/stack-frame';

const CONTEXT_SIZE: number = 3;

export type ErrorRecord = {|
  error: Error,
  unhandledRejection: boolean,
  contextSize: number,
  stackFrames: StackFrame[],
|};

export const crashWithFrames = (crash: ErrorRecord => void) => (
  error: Error,
  unhandledRejection = false
) => {
  getStackFrames(error, unhandledRejection, CONTEXT_SIZE)
    .then(stackFrames => {
      crash({
        error,
        unhandledRejection,
        contextSize: CONTEXT_SIZE,
        stackFrames,
      });
    })
    .catch(e => {
      console.log('Could not get the stack frames of error:', e);
    });
};

export function listenToRuntimeErrors(
  crash: ErrorRecord => void,
  filename: string = '/static/js/bundle.js'
) {
  const crashWithFramesRunTime = crashWithFrames(crash);

  const unregisterError = registerUnhandledError(window, error =>
    crashWithFramesRunTime(error, false)
  );
  const unregisterUnhandledRejection = registerUnhandledRejection(
    window,
    error => crashWithFramesRunTime(error, true)
  );
  registerStackTraceLimit();
  const unregisterReactStack = registerReactStack();
  permanentRegisterConsole('error', (warning, stack) => {
    const data = massageWarning(warning, stack);
    crashWithFramesRunTime(
      // $FlowFixMe
      {
        message: data.message,
        stack: data.stack,
        __unmap_source: filename,
      },
      false
    );
  });

  return () => {
    unregisterUnhandledRejection();
    unregisterError();
    unregisterReactStack();
  };
}
