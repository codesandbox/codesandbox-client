/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/* @flow */
import { areActionsEnabled } from 'app/src/sandbox/compile';
import {
  containerStyle,
  headerStyle,
  messageHeaderStyle,
  originalHeaderStyle,
  originalMessageHeaderStyle,
  overlayStyle,
} from '../styles';
import { applyStyles } from '../utils/dom/css';
import { updateAdditional } from './additional';
import { createClose } from './close';
import { createFooter } from './footer';
import { createFrames } from './frames';
import { createSuggestions } from './suggestions';
import type { CloseCallback } from './close';
import type { StackFrame } from '../utils/stack-frame';
import type { FrameSetting } from './frames';
import type { SwitchCallback } from './additional';

function createOverlay(
  document: Document,
  error: Error,
  name: ?string,
  message: string,
  frames: StackFrame[],
  contextSize: number,
  currentError: number,
  totalErrors: number,
  switchCallback: SwitchCallback,
  closeCallback: CloseCallback
): {
  overlay: HTMLDivElement,
  additional: HTMLDivElement,
} {
  const frameSettings: FrameSetting[] = frames.map(() => ({ compiled: false }));
  // Create overlay
  const overlay = document.createElement('div');
  applyStyles(overlay, overlayStyle);

  // Create container
  const container = document.createElement('div');
  applyStyles(container, containerStyle);
  overlay.appendChild(container);
  container.appendChild(createClose(document, closeCallback));

  // Create "Errors X of Y" in case of multiple errors
  const additional = document.createElement('div');
  updateAdditional(
    document,
    additional,
    currentError,
    totalErrors,
    switchCallback
  );
  container.appendChild(additional);

  // Create header
  const header = document.createElement('div');
  applyStyles(header, headerStyle);

  const messageHeader = document.createElement('div');
  applyStyles(messageHeader, messageHeaderStyle);

  // Make message prettier
  let finalMessage = message;

  finalMessage = finalMessage
    // TODO: maybe remove this prefix from fbjs?
    // It's just scaring people
    .replace(/^Invariant Violation:\s*/, '')
    // This is not helpful either:
    .replace(/^Warning:\s*/, '')
    // Break the actionable part to the next line.
    // AFAIK React 16+ should already do this.
    .replace(' Check the render method', '\n\nCheck the render method')
    .replace(' Check your code at', '\n\nCheck your code at');

  // Put it in the DOM
  header.appendChild(document.createTextNode(name || ''));
  messageHeader.appendChild(document.createTextNode(finalMessage));

  container.appendChild(header);
  container.appendChild(messageHeader);

  // If the error has been transformed
  if (error.originalName || error.originalMessage) {
    const originalErrorContainer = document.createElement('div');
    const errorHeader = document.createElement('div');
    applyStyles(errorHeader, originalHeaderStyle);
    errorHeader.appendChild(document.createTextNode('Original error:'));
    originalErrorContainer.appendChild(errorHeader);

    // Create header
    const originalMessageHeader = document.createElement('div');
    applyStyles(originalMessageHeader, originalMessageHeaderStyle);

    originalMessageHeader.appendChild(
      document.createTextNode(
        `${error.originalName || ''}: ${error.originalMessage}`
      )
    );

    originalErrorContainer.appendChild(originalMessageHeader);
    messageHeader.appendChild(originalErrorContainer);
  }

  if (
    areActionsEnabled() &&
    error.suggestions &&
    error.suggestions.length > 0
  ) {
    container.appendChild(createSuggestions(error));
  }

  // Create trace
  container.appendChild(
    createFrames(document, frames, frameSettings, contextSize, name)
  );

  // Show message
  container.appendChild(createFooter(document));

  return {
    overlay,
    additional,
  };
}

export { createOverlay };
