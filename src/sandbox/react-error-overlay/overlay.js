/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* @flow */
import { transformError } from 'codesandbox-api';

import {
  register as registerError,
  unregister as unregisterError,
} from './effects/unhandledError';
import {
  register as registerPromise,
  unregister as unregisterPromise,
} from './effects/unhandledRejection';
import {
  register as registerShortcuts,
  unregister as unregisterShortcuts,
  handler as keyEventHandler,
  SHORTCUT_ESCAPE,
  SHORTCUT_LEFT,
  SHORTCUT_RIGHT,
} from './effects/shortcuts';
import {
  register as registerStackTraceLimit,
  unregister as unregisterStackTraceLimit,
} from './effects/stackTraceLimit';
import {
  permanentRegister as permanentRegisterConsole,
  registerReactStack,
  unregisterReactStack,
} from './effects/proxyConsole';
import { massage as massageWarning } from './utils/warnings';

import {
  consume as consumeError,
  getErrorRecord,
  drain as drainErrors,
} from './utils/errorRegister';
import type { ErrorRecordReference } from './utils/errorRegister';

import type { StackFrame } from './utils/stack-frame';
import { iframeStyle } from './styles';
import { applyStyles } from './utils/dom/css';
import { createOverlay } from './components/overlay';
import { updateAdditional } from './components/additional';

import buildError from '../errors';
import { getCurrentManager } from '../compile';

const CONTEXT_SIZE: number = 3;
let iframeReference: HTMLIFrameElement | null = null;
let additionalReference = null;
let errorReferences: ErrorRecordReference[] = [];
let currReferenceIndex: number = -1;

function render(
  name: ?string,
  message: string,
  resolvedFrames: StackFrame[],
  error
) {
  disposeCurrentView();

  const iframe = window.document.createElement('iframe');
  applyStyles(iframe, iframeStyle);
  iframeReference = iframe;
  iframe.onload = () => {
    if (iframeReference == null) {
      return;
    }
    const w = iframeReference.contentWindow;
    const document = iframeReference.contentDocument;

    const { overlay, additional } = createOverlay(
      document,
      error,
      name,
      message,
      resolvedFrames,
      CONTEXT_SIZE,
      currReferenceIndex + 1,
      errorReferences.length,
      offset => {
        switchError(offset);
      },
      () => {
        unmount();
      }
    );
    if (w != null) {
      w.onkeydown = event => {
        keyEventHandler(type => shortcutHandler(type), event);
      };
    }
    if (document.body != null) {
      document.body.style.margin = '0';
      // Keep popup within body boundaries for iOS Safari
      // $FlowFixMe
      document.body.style['max-width'] = '100vw';

      (document.body: any).appendChild(overlay);
    }
    additionalReference = additional;
  };
  window.document.body.appendChild(iframe);
}

function renderErrorByIndex(index: number) {
  currReferenceIndex = index;

  const { error, unhandledRejection, enhancedFrames } = getErrorRecord(
    errorReferences[index]
  );

  if (unhandledRejection) {
    render(
      'Unhandled Rejection (' + error.name + ')',
      error.message,
      enhancedFrames,
      error
    );
  } else {
    render(error.name, error.message, enhancedFrames, error);
  }
}

function switchError(offset) {
  if (errorReferences.length === 0) {
    return;
  }

  let nextView = currReferenceIndex + offset;

  if (nextView < 0) {
    nextView = errorReferences.length - 1;
  } else if (nextView >= errorReferences.length) {
    nextView = 0;
  }

  renderErrorByIndex(nextView);
}

function disposeCurrentView() {
  if (iframeReference === null) {
    return;
  }
  window.document.body.removeChild(iframeReference);
  iframeReference = null;
  additionalReference = null;
}

function unmount() {
  disposeCurrentView();
  drainErrors();
  errorReferences = [];
  currReferenceIndex = -1;
}

function sendErrorsToEditor() {
  errorReferences.forEach(ref => {
    const error = getErrorRecord(ref);
    buildError(error);
  });
}

/**
 * Transforms the error with give transformers to codesandbox-api, this adds
 * suggestions and can alter the error name + message.
 */
function transformErrors() {
  const manager = getCurrentManager();
  if (manager) {
    errorReferences.forEach(ref => {
      const errRef = getErrorRecord(ref);

      const relevantFrame = errRef.enhancedFrames.find(r => {
        try {
          return (
            manager &&
            !!manager.resolveTranspiledModule(
              (r._originalFileName || r.fileName || '').replace(
                location.origin,
                ''
              ),
              '/'
            )
          );
        } catch (e) {
          /* don't do anything */
          return false;
        }
      });

      let tModule = errRef.error.tModule;

      if (!tModule && relevantFrame) {
        const fileName =
          relevantFrame._originalFileName || relevantFrame.fileName || '';
        tModule = manager.resolveTranspiledModule(
          fileName.replace(location.origin, ''),
          '/'
        );
      }

      if (!tModule) {
        return;
      }

      try {
        const transformation = transformError(
          errRef.error,
          tModule,
          manager.getTranspiledModules()
        );

        if (transformation) {
          errRef.error.originalName = errRef.error.name;
          errRef.error.originalMessage = errRef.error.message;

          errRef.error.name = transformation.name || errRef.error.name;
          errRef.error.message = transformation.message;
          errRef.error.suggestions = transformation.suggestions;
        }
      } catch (ex) {
        /* just catch */
        console.error(ex);
      }
    });
  }
}

function crash(error: Error, unhandledRejection = false) {
  if (module.hot && typeof module.hot.decline === 'function') {
    module.hot.decline();
  }

  consumeError(error, unhandledRejection, CONTEXT_SIZE)
    .then(ref => {
      if (ref == null) {
        return;
      }

      errorReferences.push(ref);

      sendErrorsToEditor();
      transformErrors();
      if (iframeReference !== null && additionalReference !== null) {
        updateAdditional(
          iframeReference.contentDocument,
          additionalReference,
          currReferenceIndex + 1,
          errorReferences.length,
          offset => {
            switchError(offset);
          }
        );
      } else {
        if (errorReferences.length !== 1) {
          throw new Error('Something is *really* wrong.');
        }
        renderErrorByIndex((currReferenceIndex = 0));
      }
    })
    .catch(e => {
      console.log('Could not consume error:', e);
    });
}

function shortcutHandler(type: string) {
  switch (type) {
    case SHORTCUT_ESCAPE: {
      unmount();
      break;
    }
    case SHORTCUT_LEFT: {
      switchError(-1);
      break;
    }
    case SHORTCUT_RIGHT: {
      switchError(1);
      break;
    }
    default: {
      //TODO: this
      break;
    }
  }
}

function inject() {
  registerError(window, error => crash(error));
  registerPromise(window, error => crash(error, true));
  registerShortcuts(window, shortcutHandler);
  registerStackTraceLimit();

  registerReactStack();
  permanentRegisterConsole('error', (warning, stack) => {
    const data = massageWarning(warning, stack);
    crash(
      // $FlowFixMe
      {
        message: data.message,
        stack: data.stack,
      },
      false
    );
  });
}

function uninject() {
  unregisterStackTraceLimit();
  unregisterShortcuts(window);
  unregisterPromise(window);
  unregisterError(window);
  unregisterReactStack();
  unmount();
}

export { inject, uninject };
